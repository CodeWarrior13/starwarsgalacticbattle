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
      planets: {}, // planet id -> number of stages cleared
      bosses: {}, // boss id -> wins
      squads: {
        character: ['rebel_soldier', 'clone_trooper', 'ewok_warrior', 'battle_droid', 'jawa'],
        ship: ['a_wing', 'y_wing', 'tie_fighter', 'tie_bomber', 'z95'],
      },
      stats: { battlesWon: 0, battlesLost: 0, packsOpened: 0, bestSpin: 1, holos: 0 },
      luck: { charmCrates: 0, dice: 0, pity: 0 },
      market: { refreshAt: 0, items: [] },
      flash: { endsAt: 0, items: [] },
      account: { level: 1, xp: 0 },
      daily: { streak: 0, last: null, best: 0 },
      tower: { floor: 1, best: 0, runs: 0 },
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
          planets: { ...loaded.planets },
          stats: { ...base.stats, ...loaded.stats },
          luck: { ...base.luck, ...loaded.luck },
          market: { ...base.market, ...loaded.market },
          flash: { ...base.flash, ...loaded.flash },
          account: { ...base.account, ...loaded.account },
          daily: { ...base.daily, ...loaded.daily },
          tower: { ...base.tower, ...loaded.tower },
          bosses: { ...loaded.bosses },
        }
        : base;
      delete this.state.dailyDeal;
      // Saves from before the Galaxy Map: carry cleared stages over, planet by planet.
      if (loaded && loaded.progress && !loaded.planets) {
        let cleared = (loaded.progress.character || 0) + (loaded.progress.ship || 0);
        for (const p of D.PLANETS) {
          const n = Math.min(cleared, p.stages.length);
          if (n > 0) this.state.planets[p.id] = n;
          cleared -= n;
        }
      }
      delete this.state.progress;
      // Saves from before account levels: grant XP for past victories (no rewards).
      if (loaded && !loaded.account) {
        const pastXp = this.totalCleared() * 80 + Object.values(this.state.bosses).reduce((a, n) => a + n * 150, 0);
        this.gainXp(pastXp, true);
      }
      // Squads grew to 5: hand out any missing starter units and fill the gaps.
      for (const id of D.STARTER.units) if (!this.state.units[id]) this.state.units[id] = { level: 1, stars: 1, shards: 0 };
      for (const kind of ['character', 'ship']) {
        const squad = (this.state.squads[kind] || []).filter((id) => this.state.units[id]);
        if (squad.length < D.SQUAD_SIZE[kind]) {
          for (const id of this.autoSquad(kind)) if (squad.length < D.SQUAD_SIZE[kind] && !squad.includes(id)) squad.push(id);
        }
        this.state.squads[kind] = squad;
      }
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

    // ---------- Flash sales: two steep deals that rotate every 20 minutes ----------
    flashSale(now) {
      const t = now || Date.now();
      if (!this.state.flash.items.length || t >= this.state.flash.endsAt) this.newFlashSale(t);
      return this.state.flash;
    },

    newFlashSale(now, rng) {
      const random = rng || Math.random;
      const legends = D.UNITS.filter((u) => u.rarity === 'legendary' || u.rarity === 'epic');
      const unit = legends[Math.floor(random() * legends.length)];
      const discount = [50, 60, 70][Math.floor(random() * 3)];
      const full = unit.rarity === 'legendary' ? 1800 : 1100;
      const pack = D.PACKS[Math.floor(random() * 3)];
      const packDiscount = 40;
      const packFull = pack.cost.crystals || pack.cost.credits;
      const key = pack.cost.crystals ? 'crystals' : 'credits';
      this.state.flash = {
        endsAt: now + D.FLASH_MS,
        items: [
          { type: 'shards', id: unit.id, shards: 15, discount, full, cost: { credits: Math.round(full * (1 - discount / 100)) }, sold: false },
          { type: 'pack', id: pack.id, discount: packDiscount, full: packFull, cost: { [key]: Math.round(packFull * (1 - packDiscount / 100)) }, sold: false },
        ],
      };
      this.save();
      return this.state.flash;
    },

    buyFlash(index) {
      const item = this.state.flash.items[index];
      if (!item || item.sold || !this.spend(item.cost)) return null;
      item.sold = true;
      let result;
      if (item.type === 'pack') {
        // Refund the crate's normal price so openPack's spend nets out to the sale price.
        const pack = D.PACKS.find((p) => p.id === item.id);
        this.state.credits += pack.cost.credits || 0;
        this.state.crystals += pack.cost.crystals || 0;
        result = this.openPack(item.id);
      } else if (!this.owns(item.id)) {
        result = [this.grantCard(item.id)];
      } else {
        this.state.units[item.id].shards += item.shards;
        result = [{ id: item.id, isNew: false, shards: item.shards }];
      }
      this.save();
      return result;
    },

    // ---------- Shell game: guess which cup hides the credit chip ----------
    shellGame(bet, guess, rng) {
      if (!this.spend({ credits: bet })) return null;
      const ball = Math.floor((rng || Math.random)() * 3);
      const won = guess === ball ? Math.round(bet * D.SHELL_PAYOUT) : 0;
      this.state.credits += won;
      this.save();
      return { ball, guess, won, net: won - bet };
    },

    // ---------- Daily login streak ----------
    dayKey(date) {
      const d = date || new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    dailyStatus(now) {
      const d = this.state.daily;
      const today = this.dayKey(now ? new Date(now) : new Date());
      const y = new Date(now || Date.now());
      y.setDate(y.getDate() - 1);
      const yesterday = this.dayKey(y);
      const claimed = d.last === today;
      const alive = claimed || d.last === yesterday;
      const streak = alive ? d.streak : 0;
      // Which day of the 7-day cycle is (or was) claimable today.
      const nextStreak = claimed ? streak : streak + 1;
      return { claimed, streak, nextStreak, dayIndex: (nextStreak - 1) % D.DAILY.length, best: d.best };
    },

    claimDaily(now) {
      const st = this.dailyStatus(now);
      if (st.claimed) return null;
      const reward = D.DAILY[st.dayIndex];
      const d = this.state.daily;
      d.streak = st.nextStreak;
      d.last = this.dayKey(now ? new Date(now) : new Date());
      d.best = Math.max(d.best || 0, d.streak);
      this.state.credits += reward.credits || 0;
      this.state.crystals += reward.crystals || 0;
      this.state.aurodium += reward.aurodium || 0;
      this.state.luck.dice += reward.dice || 0;
      this.state.luck.charmCrates += (reward.charm || 0) * 3;
      this.save();
      return { reward, streak: d.streak };
    },

    exchangeCrystals() {
      if (!this.spend({ crystals: 50 })) return false;
      this.state.credits += 1000;
      this.save();
      return true;
    },

    // ---------- Squads ----------
    // ---------- Account level & squad slots ----------
    slotUnlocked(rule) {
      return this.state.account.level >= rule.level && this.planetComplete(rule.planet);
    },

    // Same slot count for ground and fleet squads.
    slots() {
      return D.BASE_SLOTS + D.SLOT_UNLOCKS.filter((r) => this.slotUnlocked(r)).length;
    },

    nextSlotRule() {
      return D.SLOT_UNLOCKS.find((r) => !this.slotUnlocked(r)) || null;
    },

    gainXp(amount, silent) {
      const a = this.state.account;
      const ups = [];
      a.xp += amount;
      while (a.level < D.MAX_ACCOUNT_LEVEL && a.xp >= D.xpToNext(a.level)) {
        a.xp -= D.xpToNext(a.level);
        a.level += 1;
        const reward = D.levelReward(a.level);
        if (!silent) {
          this.state.credits += reward.credits;
          this.state.crystals += reward.crystals;
        }
        ups.push({ level: a.level, reward });
      }
      if (a.level >= D.MAX_ACCOUNT_LEVEL) a.xp = 0;
      return ups;
    },

    setSquad(kind, ids) {
      this.state.squads[kind] = ids.slice(0, this.slots());
      this.save();
    },

    // Strongest squad with a balanced core: best tank, best healer (ground
    // only), then the highest-power units to fill the rest.
    autoSquad(kind) {
      const size = this.slots();
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
        .slice(0, this.slots())
        .map((id) => ({ id, level: this.unit(id).level, stars: this.unit(id).stars }));
    },

    // ---------- Encounters ----------
    // params: { type: 'stage', kind, stage } or { type: 'boss', boss }
    encounter(params) {
      if (params.type === 'tower') {
        const t = this.state.tower;
        if (!t.seed) t.seed = 1 + Math.floor(Math.random() * 1e6);
        const floor = params.floor || t.floor;
        const f = D.towerFloor(floor, t.seed, this.slots());
        return {
          ...f, type: 'tower', floor,
          label: `Endless Tower · Floor ${floor}${f.boss ? ' · Boss' : ''}`,
        };
      }
      if (params.type === 'boss') {
        const enc = D.BOSS_ENCOUNTERS.find((b) => b.id === params.boss);
        const minions = this.padSquad(enc.minions, D.PLANET_MAP[enc.planet].reinforce[enc.kind], D.planetSquadSize(enc.unlock) - 1);
        const half = Math.ceil(minions.length / 2);
        const enemies = [...minions.slice(0, half), enc.id, ...minions.slice(half)];
        return { ...enc, type: 'boss', boss: enc.id, enemies, stars: 1, label: 'Boss Battle' };
      }
      const planet = D.PLANET_MAP[params.planet];
      const stg = planet.stages[params.stage];
      return {
        ...stg, enemies: this.padSquad(stg.enemies, planet.reinforce[stg.kind], D.planetSquadSize(planet.id)),
        type: 'stage', planet: planet.id, stage: params.stage, finale: params.stage === planet.stages.length - 1,
        stars: D.enemyStars(planet.id),
        enemyScale: planet.enemyScale || 1,
        label: `${planet.name} · Stage ${params.stage + 1} of ${planet.stages.length}`,
      };
    },

    // Top enemy squads up to full size with the planet's reinforcements.
    padSquad(ids, reinforce, size) {
      const out = ids.slice(0, size);
      let i = 0;
      while (out.length < size && reinforce && reinforce.length) out.push(reinforce[i++ % reinforce.length]);
      return out;
    },

    // ---------- Planet progress ----------
    planetCleared(id) {
      return this.state.planets[id] || 0;
    },

    planetComplete(id) {
      return this.planetCleared(id) >= D.PLANET_MAP[id].stages.length;
    },

    planetUnlocked(id) {
      const i = D.PLANETS.findIndex((p) => p.id === id);
      return i === 0 || this.planetComplete(D.PLANETS[i - 1].id);
    },

    // The furthest planet the player can fight on right now.
    currentPlanet() {
      return D.PLANETS.find((p) => this.planetUnlocked(p.id) && !this.planetComplete(p.id)) || D.PLANETS[D.PLANETS.length - 1];
    },

    totalCleared() {
      return D.PLANETS.reduce((a, p) => a + this.planetCleared(p.id), 0);
    },

    bossUnlocked(enc) {
      return this.planetComplete(enc.unlock);
    },

    // Endless Tower: climb on a win, fall back to the checkpoint on a loss.
    completeTower(params, won, rng, slotsBefore) {
      const t = this.state.tower;
      const enc = this.encounter(params);
      const floor = enc.floor;
      if (!won) {
        this.state.stats.battlesLost += 1;
        const back = D.towerCheckpoint(floor);
        const fell = t.floor !== back;
        t.floor = back;
        t.runs = (t.runs || 0) + 1;
        if (fell) t.seed = (t.seed || 1) + 1;
        const levelUps = this.gainXp(D.XP.loss);
        this.save();
        return { lost: true, xp: D.XP.loss, levelUps, newSlot: this.slots() > slotsBefore, towerFloor: back, fell };
      }
      const spin = this.rollSpin(rng);
      this.state.stats.bestSpin = Math.max(this.state.stats.bestSpin, spin.mult);
      this.state.stats.battlesWon += 1;
      const r = D.towerRewards(floor);
      const newBest = floor > (t.best || 0);
      if (floor === t.floor) t.floor = floor + 1;
      t.best = Math.max(t.best || 0, floor);
      const out = { base: r.credits, crystals: r.crystals, aurodium: 0, firstClear: newBest, card: null, mult: spin.mult, table: spin.table, loaded: spin.loaded, towerFloor: t.floor, newBest };
      out.credits = Math.round(out.base * spin.mult);
      out.xp = enc.boss ? D.XP.boss(enc.level) : D.XP.stage(enc.level);
      out.levelUps = this.gainXp(out.xp);
      out.newSlot = this.slots() > slotsBefore;
      this.state.credits += out.credits;
      this.state.crystals += out.crystals;
      this.save();
      return out;
    },

    // Record a finished battle and grant rewards (with the luck spin applied).
    completeEncounter(params, won, rng) {
      const slotsBefore = this.slots();
      if (params.type === 'tower') return this.completeTower(params, won, rng, slotsBefore);
      if (!won) {
        this.state.stats.battlesLost += 1;
        const levelUps = this.gainXp(D.XP.loss);
        this.save();
        return { lost: true, xp: D.XP.loss, levelUps, newSlot: this.slots() > slotsBefore };
      }
      const spin = this.rollSpin(rng);
      this.state.stats.bestSpin = Math.max(this.state.stats.bestSpin, spin.mult);
      this.state.stats.battlesWon += 1;
      let out;
      let kind;
      if (params.type === 'boss') {
        const enc = D.BOSS_ENCOUNTERS.find((b) => b.id === params.boss);
        kind = enc.kind;
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
        const planet = D.PLANET_MAP[params.planet];
        kind = planet.stages[params.stage].kind;
        const r = D.stageRewards(planet.id, params.stage);
        const firstClear = this.planetCleared(planet.id) === params.stage;
        let planetBonus = 0;
        if (firstClear) {
          this.state.planets[planet.id] = params.stage + 1;
          if (this.planetComplete(planet.id)) planetBonus = D.PLANET_CLEAR_KYBER;
        }
        out = { base: r.credits, crystals: (firstClear ? r.firstClearCrystals : 0) + planetBonus, aurodium: 0, firstClear, card: null, planetComplete: planetBonus > 0 };
      }
      // Bounty Hunters synergy pays out extra credits.
      const squad = this.state.squads[kind].filter((id) => this.owns(id));
      out.bounty = D.squadBonuses(squad).active.some((a) => a.trait === 'bounty');
      out.mult = spin.mult;
      out.table = spin.table;
      out.loaded = spin.loaded;
      out.credits = Math.round(out.base * spin.mult * (out.bounty ? 1.2 : 1));
      const enc = this.encounter(params);
      out.xp = params.type === 'boss' ? D.XP.boss(enc.level) : D.XP.stage(enc.level);
      out.levelUps = this.gainXp(out.xp);
      out.newSlot = this.slots() > slotsBefore;
      this.state.credits += out.credits;
      this.state.crystals += out.crystals;
      this.state.aurodium += out.aurodium;
      this.save();
      return out;
    },
  };

  root.Player = Player;
})(typeof window !== 'undefined' ? window : globalThis);
