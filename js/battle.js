// Turn-based battle engine. Has no DOM access: it returns event lists that
// the UI plays back as animations.
//
// Turn order uses a turn meter: every unit fills its meter at a rate equal to
// its speed, and whoever reaches 100 first takes the next turn.

(function (root) {
  const D = root.GameData;
  const CRIT_CHANCE = 0.15;
  const CRIT_MULT = 1.5;
  const ULT_PER_ACTION = 9;
  const ULT_PER_DEALT = 45; // per 100% of a target's max HP dealt
  const ULT_PER_TAKEN = 60; // per 100% of own max HP taken

  let uidCounter = 0;

  function makeCombatant(entry, side, index) {
    const def = D.UNIT_MAP[entry.id];
    const stats = D.unitStats(def, entry.level, entry.stars);
    const abilities = D.abilitiesFor(def);
    return {
      uid: `${side}-${index}-${++uidCounter}`,
      id: def.id,
      def,
      abilities,
      side,
      index,
      level: entry.level,
      stars: entry.stars,
      maxHp: stats.hp,
      hp: stats.hp,
      atk: stats.atk,
      armor: stats.def,
      spd: stats.spd,
      // Stagger the opening a little so equal-speed units don't tie.
      tm: Math.min(40, index * 3 + (side === 'player' ? 5 : 0)),
      cooldowns: abilities.map(() => 0),
      ult: 0,
      statuses: {},
      alive: true,
    };
  }

  class Battle {
    constructor(playerSquad, enemySquad, rng) {
      this.rng = rng || Math.random;
      this.units = [
        ...playerSquad.map((e, i) => makeCombatant(e, 'player', i)),
        ...enemySquad.map((e, i) => makeCombatant(e, 'enemy', i)),
      ];
      this.turnCount = 0;
    }

    get(uid) {
      return this.units.find((u) => u.uid === uid);
    }

    side(side) {
      return this.units.filter((u) => u.side === side);
    }

    living(side) {
      return this.units.filter((u) => u.alive && u.side === side);
    }

    opponents(unit) {
      return this.living(unit.side === 'player' ? 'enemy' : 'player');
    }

    allies(unit) {
      return this.living(unit.side);
    }

    winner() {
      if (this.living('enemy').length === 0) return 'player';
      if (this.living('player').length === 0) return 'enemy';
      return null;
    }

    // Advance every turn meter until someone reaches 100 and return them.
    advance() {
      const alive = this.units.filter((u) => u.alive);
      let best = null;
      let bestTime = Infinity;
      for (const u of alive) {
        const t = Math.max(0, 100 - u.tm) / u.spd;
        if (t < bestTime - 1e-9 || (Math.abs(t - bestTime) < 1e-9 && u.spd > best.spd)) {
          best = u;
          bestTime = t;
        }
      }
      for (const u of alive) u.tm += u.spd * bestTime;
      best.tm = 100;
      this.turnCount++;
      return best;
    }

    // Upcoming turn order preview without mutating state.
    predictOrder(count) {
      const sim = this.units.filter((u) => u.alive).map((u) => ({ uid: u.uid, tm: u.tm, spd: u.spd }));
      const order = [];
      for (let n = 0; n < count && sim.length; n++) {
        let best = null;
        let bestTime = Infinity;
        for (const u of sim) {
          const t = Math.max(0, 100 - u.tm) / u.spd;
          if (t < bestTime - 1e-9 || (Math.abs(t - bestTime) < 1e-9 && u.spd > best.spd)) {
            best = u;
            bestTime = t;
          }
        }
        for (const u of sim) u.tm += u.spd * bestTime;
        best.tm = 0;
        order.push(best.uid);
      }
      return order;
    }

    // Start-of-turn upkeep: burn damage, stun check, status and cooldown ticks.
    beginTurn(unit) {
      const events = [{ type: 'turn', uid: unit.uid }];
      if (unit.statuses.burn) {
        const amount = Math.max(1, Math.round(unit.maxHp * 0.08));
        this.applyDamage(unit, amount, false, events, 'burn');
      }
      let skipped = false;
      if (unit.alive && unit.statuses.stun) {
        skipped = true;
        events.push({ type: 'skip', uid: unit.uid });
        events.push({ type: 'log', text: `${unit.def.name} is stunned and loses their turn.` });
      }
      for (const key of Object.keys(unit.statuses)) {
        unit.statuses[key] -= 1;
        if (unit.statuses[key] <= 0) {
          delete unit.statuses[key];
          events.push({ type: 'statusEnd', uid: unit.uid, status: key });
        }
      }
      unit.cooldowns = unit.cooldowns.map((c) => Math.max(0, c - 1));
      if (!unit.alive) skipped = true;
      if (skipped) unit.tm = 0;
      return { events, skipped };
    }

    isReady(unit, abilityIndex) {
      if (unit.abilities[abilityIndex].ultimate) return unit.ult >= 100;
      return unit.cooldowns[abilityIndex] === 0;
    }

    validTargets(unit, abilityIndex) {
      const ab = unit.abilities[abilityIndex];
      if (ab.target === 'enemy') {
        const foes = this.opponents(unit);
        const taunters = foes.filter((f) => f.statuses.taunt);
        return taunters.length ? taunters : foes;
      }
      if (ab.target === 'ally') return this.allies(unit);
      return [];
    }

    needsTarget(unit, abilityIndex) {
      const t = unit.abilities[abilityIndex].target;
      return t === 'enemy' || t === 'ally';
    }

    resolveTargets(unit, ab, targetUid) {
      switch (ab.target) {
        case 'enemy':
        case 'ally':
          return [this.get(targetUid)];
        case 'allEnemies':
          return this.opponents(unit);
        case 'allAllies':
          return this.allies(unit);
        default:
          return [unit];
      }
    }

    act(unit, abilityIndex, targetUid) {
      const ab = unit.abilities[abilityIndex];
      if (!this.isReady(unit, abilityIndex)) throw new Error(`${ab.name} is not ready`);
      if (this.needsTarget(unit, abilityIndex)) {
        const valid = this.validTargets(unit, abilityIndex).map((u) => u.uid);
        if (!valid.includes(targetUid)) throw new Error('Invalid target');
      }

      const targets = this.resolveTargets(unit, ab, targetUid);
      const offensive = ab.target === 'enemy' || ab.target === 'allEnemies';
      const events = [{
        type: 'use', uid: unit.uid, ability: ab.name, abilityIndex, ultimate: !!ab.ultimate,
        targets: targets.map((t) => t.uid), offensive, aoe: ab.target.startsWith('all'),
      }];
      const targetText = ab.target === 'allEnemies' ? 'all enemies'
        : ab.target === 'allAllies' ? 'all allies'
          : ab.target === 'self' ? '' : targets[0].def.name;
      events.push({ type: 'log', text: `${unit.def.name} uses ${ab.name}${targetText ? ' on ' + targetText : ''}.`, side: unit.side });

      this.currentUltimate = !!ab.ultimate;
      for (const eff of ab.effects) {
        let recipients = targets;
        if (eff.on === 'self') recipients = [unit];
        else if (eff.on === 'allies') recipients = this.allies(unit);
        for (const target of recipients) {
          if (!target.alive) continue;
          this.applyEffect(unit, target, eff, events);
        }
      }

      this.currentUltimate = false;
      if (ab.ultimate) {
        unit.ult = 0;
      } else {
        unit.cooldowns[abilityIndex] = ab.cd;
        this.chargeUlt(unit, ULT_PER_ACTION);
      }
      events.push({ type: 'ult', uid: unit.uid, value: unit.ult });
      unit.tm = Math.max(0, unit.tm - 100);
      return events;
    }

    applyEffect(source, target, eff, events) {
      switch (eff.type) {
        case 'damage':
          for (let h = 0; h < eff.hits && target.alive; h++) {
            const { amount, crit } = this.rollDamage(source, target, eff.mult);
            this.applyDamage(target, amount, crit, events);
            if (!this.currentUltimate) this.chargeUlt(source, (amount / target.maxHp) * ULT_PER_DEALT);
          }
          break;
        case 'heal': {
          const amount = Math.min(target.maxHp - target.hp, Math.round(target.maxHp * eff.pct));
          target.hp += amount;
          events.push({ type: 'heal', uid: target.uid, amount, hp: target.hp });
          break;
        }
        case 'status': {
          if (this.rng() >= eff.chance) {
            events.push({ type: 'resist', uid: target.uid });
            break;
          }
          target.statuses[eff.status] = Math.max(target.statuses[eff.status] || 0, eff.turns);
          events.push({ type: 'status', uid: target.uid, status: eff.status, turns: eff.turns });
          break;
        }
        case 'tm':
          target.tm = Math.min(200, target.tm + eff.amount);
          events.push({ type: 'tm', uid: target.uid, amount: eff.amount });
          break;
        default:
          break;
      }
    }

    effectiveAtk(u) {
      let a = u.atk;
      if (u.statuses.offUp) a *= 1.5;
      if (u.statuses.offDown) a *= 0.6;
      return a;
    }

    effectiveArmor(u) {
      let d = u.armor;
      if (u.statuses.defUp) d *= 1.5;
      if (u.statuses.defDown) d *= 0.5;
      return d;
    }

    rollDamage(source, target, mult) {
      const variance = 0.9 + this.rng() * 0.2;
      const crit = this.rng() < CRIT_CHANCE;
      const mitigation = 150 / (150 + this.effectiveArmor(target));
      let amount = this.effectiveAtk(source) * 1.7 * mult * mitigation * variance;
      if (crit) amount *= CRIT_MULT;
      return { amount: Math.max(1, Math.round(amount)), crit };
    }

    chargeUlt(unit, amount) {
      if (unit.alive) unit.ult = Math.min(100, unit.ult + amount);
    }

    applyDamage(target, amount, crit, events, source) {
      target.hp = Math.max(0, target.hp - amount);
      this.chargeUlt(target, (amount / target.maxHp) * ULT_PER_TAKEN);
      events.push({ type: 'damage', uid: target.uid, amount, crit, hp: target.hp, source });
      if (target.hp === 0 && target.alive) {
        target.alive = false;
        target.statuses = {};
        target.tm = 0;
        target.ult = 0;
        events.push({ type: 'ko', uid: target.uid });
        events.push({ type: 'log', text: `${target.def.name} has been defeated!`, side: target.side === 'player' ? 'enemy' : 'player' });
      }
    }

    // Simple AI used by enemies and by the player's auto-battle.
    chooseAction(unit) {
      const abilities = unit.abilities;
      const allies = this.allies(unit);
      const hurt = allies.filter((a) => a.hp / a.maxHp < 0.65);
      let choice = 0;
      for (let i = abilities.length - 1; i > 0; i--) {
        if (!this.isReady(unit, i)) continue;
        const ab = abilities[i];
        if (ab.ultimate) {
          choice = i;
          break;
        }
        const heals = ab.effects.some((e) => e.type === 'heal');
        const offensive = ab.target === 'enemy' || ab.target === 'allEnemies';
        if (heals && !offensive && hurt.length === 0 && ab.target !== 'self') continue;
        if (ab.target === 'self' && heals && unit.hp / unit.maxHp > 0.8 && !ab.effects.some((e) => e.status === 'taunt')) continue;
        choice = i;
        break;
      }
      let targetUid = null;
      if (this.needsTarget(unit, choice)) {
        const valid = this.validTargets(unit, choice);
        if (this.rng() < 0.7) {
          valid.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
          targetUid = valid[0].uid;
        } else {
          targetUid = valid[Math.floor(this.rng() * valid.length)].uid;
        }
      }
      return { abilityIndex: choice, targetUid };
    }
  }

  root.Battle = Battle;
})(typeof window !== 'undefined' ? window : globalThis);
