// Player progress: roster, currencies, campaign and boss progress, luck and
// the Black Market. Saved to localStorage so progress survives page reloads.

(function (root) {
  const D = root.GameData;
  const SAVE_KEY = 'swcg-save-v1';

  function freshState() {
    const units = {};
    for (const id of D.STARTER.units) units[id] = { level: 1, stars: 1, shards: 0 };
    return {
      credits: D.STARTER.credits,
      crystals: D.STARTER.crystals,
      aurodium: 0,
      units,
      progress: { character: 0, ship: 0 }, // number of stages cleared
      bosses: {}, // boss id -> wins
      squads: {
        character: ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid'],
        ship: ['a_wing', 'y_wing', 'tie_fighter'],
      },
      stats: { battlesWon: 0, battlesLost: 0, packsOpened: 0, bestSpin: 1, holos: 0 },
      luck: { charmCrates: 0, dice: 0, pity: 0 },
      market: { refreshAt: 0, items: [] },
    };
  }

  function storage() {
    try {
      return root.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  function weighted(table, rng) {
    const total = table.reduce((a, t) => a + t.weight, 0);
    let r = (rng || Math.random)() * total;
    for (const t of table) {
      if (r < t.weight) return t;
      r -= t.weight;
    }
    return table[table.length - 1];
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
      this.state = loaded
        ? {
          ...base,
          ...loaded,
          progress: { ...base.progress, ...loaded.progress },
          stats: { ...base.stats, ...loaded.stats },
          luck: { ...base.luck, ...loaded.luck },
          market: { ...base.market, ...loaded.market },
          bosses: { ...loaded.bosses },
        }
        : base;
      delete this.state.dailyDeal;
      for (const id of Object.keys(this.state.units)) if (!D.UNIT_MAP[id] || D.UNIT_MAP[id].boss) delete this.state.units[id];
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

    powerOf(id) {
      const u = this.unit(id);
      return u ? D.power(D.UNIT_MAP[id], u.level, u.stars) : 0;
    },

    canAfford(cost) {
      return (cost.credits || 0) <= this.state.credits
        && (cost.crystals || 0) <= this.state.crystals
        && (cost.aurodium || 0) <= this.state.aurodium;
    },

    spend(cost) {
      if (!this.canAfford(cost)) return false;
      this.state.credits -= cost.credits || 0;
      this.state.crystals -= cost.crystals || 0;
      this.state.aurodium -= cost.aurodium || 0;
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
    // Holo cards start at 2★ when new, or give double shards as duplicates.
    grantCard(id, holo) {
      const def = D.UNIT_MAP[id];
      if (holo) this.state.stats.holos += 1;
      if (!this.owns(id)) {
        this.state.units[id] = { level: 1, stars: holo ? 2 : 1, shards: 0 };
        return { id, isNew: true, shards: 0, holo: !!holo };
      }
      const shards = D.DUPLICATE_SHARDS[def.rarity] * (holo ? 2 : 1);
      this.state.units[id].shards += shards;
      return { id, isNew: false, shards, holo: !!holo };
    },

    collectable(kind) {
      return D.UNITS.filter((u) => kind === 'any' || u.kind === kind);
    },

    rollRarity(odds, rng) {
      return weighted(Object.entries(odds).map(([rarity, weight]) => ({ rarity, weight })), rng).rarity;
    },

    // Odds after the Chance Cubes charm is applied.
    effectiveOdds(pack) {
      const odds = { ...pack.odds };
      if (this.state.luck.charmCrates > 0) {
        odds.legendary *= D.LUCK.charmOdds.legendary;
        odds.epic *= D.LUCK.charmOdds.epic;
      }
      return odds;
    },

    openPack(packId, rng) {
      const random = rng || Math.random;
      const pack = D.PACKS.find((p) => p.id === packId);
      if (!pack || !this.spend(pack.cost)) return null;
      const luck = this.state.luck;
      const charmed = luck.charmCrates > 0;
      const odds = this.effectiveOdds(pack);
      const rarities = [];
      for (let i = 0; i < pack.count; i++) rarities.push(this.rollRarity(odds, random));
      const pityHit = !rarities.includes('legendary') && luck.pity + 1 >= D.LUCK.pityCrates;
      if (pack.guarantee === 'legendary' || pityHit) {
        if (!rarities.includes('legendary')) rarities[rarities.length - 1] = 'legendary';
      }
      const results = rarities.map((rarity) => {
        let pool = this.collectable(pack.kind).filter((u) => u.rarity === rarity);
        if (!pool.length) pool = this.collectable(pack.kind);
        const pick = pool[Math.floor(random() * pool.length)];
        const holo = random() < (charmed ? D.LUCK.holoChanceCharmed : D.LUCK.holoChance);
        return { ...this.grantCard(pick.id, holo), pity: pityHit && rarity === 'legendary' };
      });
      luck.pity = rarities.includes('legendary') ? 0 : luck.pity + 1;
      if (charmed) luck.charmCrates -= 1;
      this.state.stats.packsOpened += 1;
      this.save();
      return results;
    },

    buyCharm(id) {
      const charm = D.CHARMS.find((c) => c.id === id);
      if (!charm || !this.spend(charm.cost)) return false;
      for (const [k, v] of Object.entries(charm.grants)) this.state.luck[k] += v;
      this.save();
      return true;
    },

    // Sabacc: three face-down cards; the one you pick decides your payout.
    sabacc(bet, pick, rng) {
      if (!this.spend({ credits: bet })) return null;
      const cards = [0, 1, 2].map(() => weighted(D.LUCK.sabacc, rng));
      const won = Math.round(bet * cards[pick].mult);
      this.state.credits += won;
      this.save();
      return { cards, pick, won, net: won - bet };
    },

    rollSpin(rng) {
      const loaded = this.state.luck.dice > 0;
      const table = loaded ? D.LUCK.rewardSpinLoaded : D.LUCK.rewardSpin;
      if (loaded) this.state.luck.dice -= 1;
      return { mult: weighted(table, rng).mult, table, loaded };
    },

    // ---------- Black Market stock ----------
    marketStock(now) {
      const t = now || Date.now();
      const m = this.state.market;
      if (!m.items.length || t >= m.refreshAt) this.restock(t);
      return this.state.market;
    },

    restock(now, rng) {
      const random = rng || Math.random;
      const pool = D.UNITS.filter((u) => u.rarity !== 'common');
      const picks = [];
      while (picks.length < 5) {
        const rarity = weighted([{ r: 'rare', weight: 45 }, { r: 'epic', weight: 38 }, { r: 'legendary', weight: 17 }], random).r;
        const options = pool.filter((u) => u.rarity === rarity && !picks.some((p) => p.id === u.id));
        if (options.length) picks.push(options[Math.floor(random() * options.length)]);
      }
      const perShard = { rare: 30, epic: 50, legendary: 90 };
      const items = picks.map((def, i) => {
        const discount = weighted([{ d: 0, weight: 40 }, { d: 10, weight: 25 }, { d: 20, weight: 18 }, { d: 30, weight: 10 }, { d: 50, weight: 7 }], random).d;
        const shards = def.rarity === 'legendary' ? 10 : 12;
        const kyber = i === 4;
        const full = kyber ? Math.round((shards * perShard[def.rarity]) / 12) : shards * perShard[def.rarity];
        const price = Math.max(1, Math.round(full * (1 - discount / 100)));
        return { id: def.id, shards, discount, hot: discount >= 30, sold: false, cost: kyber ? { crystals: price } : { credits: price }, full };
      });
      this.state.market = { refreshAt: (now || Date.now()) + D.MARKET_REFRESH_MS, items };
      this.save();
      return this.state.market;
    },

    rerollMarket() {
      if (!this.spend({ crystals: 20 })) return false;
      this.restock(Date.now());
      return true;
    },

    buyMarket(index) {
      const item = this.state.market.items[index];
      if (!item || item.sold || !this.spend(item.cost)) return null;
      item.sold = true;
      let result;
      if (!this.owns(item.id)) {
        result = this.grantCard(item.id);
      } else {
        this.state.units[item.id].shards += item.shards;
        result = { id: item.id, isNew: false, shards: item.shards };
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

    // ---------- Squads ----------
    setSquad(kind, ids) {
      this.state.squads[kind] = ids.slice(0, D.SQUAD_SIZE[kind]);
      this.save();
    },

    // Strongest squad with a balanced core: best tank, best healer (ground
    // only), then the highest-power units to fill the rest.
    autoSquad(kind) {
      const size = D.SQUAD_SIZE[kind];
      const owned = D.UNITS.filter((u) => u.kind === kind && this.owns(u.id))
        .sort((a, b) => this.powerOf(b.id) - this.powerOf(a.id));
      const squad = [];
      const tank = owned.find((u) => u.role === 'tank');
      if (tank) squad.push(tank.id);
      if (kind === 'character') {
        const healer = owned.find((u) => u.role === 'healer');
        if (healer) squad.push(healer.id);
      }
      for (const u of owned) {
        if (squad.length >= size) break;
        if (!squad.includes(u.id)) squad.push(u.id);
      }
      return squad.sort((a, b) => this.powerOf(b) - this.powerOf(a)).slice(0, size);
    },

    squadEntries(kind) {
      return this.state.squads[kind]
        .filter((id) => this.owns(id))
        .map((id) => ({ id, level: this.unit(id).level, stars: this.unit(id).stars }));
    },

    // ---------- Encounters ----------
    // params: { type: 'stage', kind, stage } or { type: 'boss', boss }
    encounter(params) {
      if (params.type === 'boss') {
        const enc = D.BOSS_ENCOUNTERS.find((b) => b.id === params.boss);
        const minions = enc.minions;
        const half = Math.ceil(minions.length / 2);
        const enemies = [...minions.slice(0, half), enc.id, ...minions.slice(half)];
        return { ...enc, type: 'boss', boss: enc.id, enemies, label: 'Boss Battle' };
      }
      const st = D.CAMPAIGNS[params.kind].stages[params.stage];
      return { ...st, type: 'stage', kind: params.kind, stage: params.stage, label: `Stage ${params.stage + 1} · ${D.CAMPAIGNS[params.kind].name}` };
    },

    bossUnlocked(enc) {
      return this.state.progress[enc.unlock.kind] >= enc.unlock.stage;
    },

    // Record a finished battle and grant rewards (with the luck spin applied).
    completeEncounter(params, won, rng) {
      if (!won) {
        this.state.stats.battlesLost += 1;
        this.save();
        return null;
      }
      const spin = this.rollSpin(rng);
      this.state.stats.bestSpin = Math.max(this.state.stats.bestSpin, spin.mult);
      this.state.stats.battlesWon += 1;
      let out;
      if (params.type === 'boss') {
        const enc = D.BOSS_ENCOUNTERS.find((b) => b.id === params.boss);
        const firstClear = !this.state.bosses[enc.id];
        const r = D.bossRewards(enc, firstClear);
        this.state.bosses[enc.id] = (this.state.bosses[enc.id] || 0) + 1;
        let card = null;
        if (r.card) {
          const pool = D.UNITS.filter((u) => u.kind === enc.kind && (u.rarity === 'epic' || u.rarity === 'legendary'));
          const pick = pool[Math.floor((rng || Math.random)() * pool.length)];
          card = this.grantCard(pick.id, false);
        }
        out = { base: r.credits, crystals: r.kyber, aurodium: r.aurodium, firstClear, card };
      } else {
        const r = D.stageRewards(params.kind, params.stage);
        const firstClear = this.state.progress[params.kind] === params.stage;
        if (firstClear) this.state.progress[params.kind] = params.stage + 1;
        out = { base: r.credits, crystals: firstClear ? r.firstClearCrystals : 0, aurodium: 0, firstClear, card: null };
      }
      out.mult = spin.mult;
      out.table = spin.table;
      out.loaded = spin.loaded;
      out.credits = Math.round(out.base * spin.mult);
      this.state.credits += out.credits;
      this.state.crystals += out.crystals;
      this.state.aurodium += out.aurodium;
      this.save();
      return out;
    },
  };

  root.Player = Player;
})(typeof window !== 'undefined' ? window : globalThis);
