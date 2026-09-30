// Player progress: roster, currencies, campaign progress and shop purchases.
// Saved to localStorage so progress survives page reloads.

(function (root) {
  const D = root.GameData;
  const SAVE_KEY = 'swcg-save-v1';

  function freshState() {
    const units = {};
    for (const id of D.STARTER.units) units[id] = { level: 1, stars: 1, shards: 0 };
    return {
      credits: D.STARTER.credits,
      crystals: D.STARTER.crystals,
      units,
      progress: { character: 0, ship: 0 }, // number of stages cleared
      squads: {
        character: ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid'],
        ship: ['a_wing', 'y_wing', 'tie_fighter'],
      },
      stats: { battlesWon: 0, battlesLost: 0, packsOpened: 0 },
      dailyDeal: { day: null, bought: false },
    };
  }

  function storage() {
    try {
      return root.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  const Player = {
    state: null,

    load() {
      const store = storage();
      let loaded = null;
      try {
        const raw = store && store.getItem(SAVE_KEY);
        loaded = raw ? JSON.parse(raw) : null;
      } catch (e) {
        loaded = null;
      }
      const base = freshState();
      this.state = loaded ? { ...base, ...loaded, progress: { ...base.progress, ...loaded.progress } } : base;
      // Drop any units that no longer exist in the data.
      for (const id of Object.keys(this.state.units)) if (!D.UNIT_MAP[id]) delete this.state.units[id];
      return this.state;
    },

    save() {
      const store = storage();
      try {
        if (store) store.setItem(SAVE_KEY, JSON.stringify(this.state));
      } catch (e) {
        // Storage full or blocked: keep playing without saving.
      }
    },

    reset() {
      this.state = freshState();
      this.save();
    },

    owns(id) {
      return !!this.state.units[id];
    },

    unit(id) {
      return this.state.units[id];
    },

    canAfford(cost) {
      return (cost.credits || 0) <= this.state.credits && (cost.crystals || 0) <= this.state.crystals;
    },

    spend(cost) {
      if (!this.canAfford(cost)) return false;
      this.state.credits -= cost.credits || 0;
      this.state.crystals -= cost.crystals || 0;
      return true;
    },

    levelUp(id) {
      const u = this.unit(id);
      if (!u || u.level >= D.MAX_LEVEL) return false;
      if (!this.spend({ credits: D.levelCost(u.level) })) return false;
      u.level += 1;
      this.save();
      return true;
    },

    starUp(id) {
      const u = this.unit(id);
      if (!u || u.stars >= D.MAX_STARS) return false;
      const need = D.STAR_COSTS[u.stars - 1];
      if (u.shards < need) return false;
      u.shards -= need;
      u.stars += 1;
      this.save();
      return true;
    },

    // Grant a unit card: unlocks it, or converts a duplicate into shards.
    grantCard(id) {
      const def = D.UNIT_MAP[id];
      if (!this.owns(id)) {
        this.state.units[id] = { level: 1, stars: 1, shards: 0 };
        return { id, isNew: true, shards: 0 };
      }
      const shards = D.DUPLICATE_SHARDS[def.rarity];
      this.state.units[id].shards += shards;
      return { id, isNew: false, shards };
    },

    rollRarity(odds, rng) {
      const total = Object.values(odds).reduce((a, b) => a + b, 0);
      let r = (rng || Math.random)() * total;
      for (const [rarity, weight] of Object.entries(odds)) {
        if (r < weight) return rarity;
        r -= weight;
      }
      return 'common';
    },

    openPack(packId, rng) {
      const pack = D.PACKS.find((p) => p.id === packId);
      if (!pack || !this.spend(pack.cost)) return null;
      const results = [];
      for (let i = 0; i < pack.count; i++) {
        const rarity = this.rollRarity(pack.odds, rng);
        let pool = D.UNITS.filter((u) => u.rarity === rarity && (pack.kind === 'any' || u.kind === pack.kind));
        if (!pool.length) pool = D.UNITS.filter((u) => pack.kind === 'any' || u.kind === pack.kind);
        const pick = pool[Math.floor((rng || Math.random)() * pool.length)];
        results.push(this.grantCard(pick.id));
      }
      this.state.stats.packsOpened += 1;
      this.save();
      return results;
    },

    today() {
      return new Date().toISOString().slice(0, 10);
    },

    // One featured unit per day, sold as shards.
    dailyDeal() {
      const day = this.today();
      if (this.state.dailyDeal.day !== day) this.state.dailyDeal = { day, bought: false };
      let hash = 0;
      for (const ch of day) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
      const pool = D.UNITS.filter((u) => u.rarity !== 'common');
      const def = pool[hash % pool.length];
      return { def, shards: 15, cost: { credits: 500 }, bought: this.state.dailyDeal.bought };
    },

    buyDailyDeal() {
      const deal = this.dailyDeal();
      if (deal.bought || !this.spend(deal.cost)) return null;
      this.state.dailyDeal.bought = true;
      let result;
      if (!this.owns(deal.def.id)) {
        result = this.grantCard(deal.def.id);
      } else {
        this.state.units[deal.def.id].shards += deal.shards;
        result = { id: deal.def.id, isNew: false, shards: deal.shards };
      }
      this.save();
      return result;
    },

    exchangeCrystals() {
      if (!this.spend({ crystals: 50 })) return false;
      this.state.credits += 1000;
      this.save();
      return true;
    },

    setSquad(kind, ids) {
      this.state.squads[kind] = ids.slice(0, D.SQUAD_SIZE[kind]);
      this.save();
    },

    squadEntries(kind) {
      return this.state.squads[kind]
        .filter((id) => this.owns(id))
        .map((id) => ({ id, level: this.unit(id).level, stars: this.unit(id).stars }));
    },

    // Record a finished battle. Returns the rewards granted.
    completeStage(kind, index, won) {
      if (!won) {
        this.state.stats.battlesLost += 1;
        this.save();
        return null;
      }
      const r = D.stageRewards(kind, index);
      const firstClear = this.state.progress[kind] === index;
      this.state.credits += r.credits;
      if (firstClear) {
        this.state.crystals += r.firstClearCrystals;
        this.state.progress[kind] = index + 1;
      }
      this.state.stats.battlesWon += 1;
      this.save();
      return { credits: r.credits, crystals: firstClear ? r.firstClearCrystals : 0, firstClear };
    },
  };

  root.Player = Player;
})(typeof window !== 'undefined' ? window : globalThis);
