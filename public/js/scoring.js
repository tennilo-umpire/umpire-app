/** TENNILO Umpire U0.1 – pure, event-sourced tennis scoring engine. */
export function newMatch({ playerA = 'Spieler A', playerB = 'Spieler B', bestOf = 3, firstServer = 0, noAd = false } = {}) {
  if (![3, 5].includes(Number(bestOf))) throw new RangeError('Best of muss 3 oder 5 sein.');
  if (![0, 1].includes(Number(firstServer))) throw new RangeError('Aufschläger muss 0 oder 1 sein.');
  const names = [playerA, playerB].map(s => String(s).trim().slice(0, 70));
  if (names.some(s => !s)) throw new Error('Beide Spielernamen fehlen.');
  return {
    version: 1,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    players: names,
    rules: { bestOf: Number(bestOf), firstServer: Number(firstServer), noAd: Boolean(noAd), tiebreakAt: 6 },
    events: []
  };
}

function scoreOnePoint(state, side, rules) {
  if (state.finished) return;
  state.points[side]++;
  const other = 1 - side;
  const tiebreak = state.games[0] === 6 && state.games[1] === 6;
  const needed = tiebreak ? 7 : 4;
  const enough = state.points[side] >= needed;
  const clear = state.points[side] - state.points[other] >= 2;
  if (!enough || (!clear && !(!tiebreak && rules.noAd))) return;

  if (tiebreak) {
    state.completedSets.push({ games: [7 - (side === 1 ? 1 : 0), 7 - (side === 0 ? 1 : 0)], tiebreak: [...state.points] });
    state.setsWon[side]++;
    state.games = [0, 0];
    state.points = [0, 0];
    state.gameServer = 1 - state.gameServer; // After a TB, the next set starts with the opposite server.
  } else {
    state.games[side]++;
    state.points = [0, 0];
    state.gameServer = 1 - state.gameServer;
    if ((state.games[side] >= 6 && state.games[side] - state.games[other] >= 2)) {
      state.completedSets.push({ games: [...state.games] });
      state.setsWon[side]++;
      state.games = [0, 0];
    }
  }
  if (state.setsWon[side] >= (rules.bestOf + 1) / 2) {
    state.finished = true;
    state.winner = side;
  }
}

export function getState(match) {
  if (!match || match.version !== 1 || !Array.isArray(match.events)) throw new Error('Ungültige Matchdaten.');
  const revoked = new Set(match.events.filter(e => e.kind === 'revoke').map(e => e.target));
  const effective = match.events.filter(e => e.kind === 'point' && !revoked.has(e.id));
  const state = {
    players: match.players, completedSets: [], games: [0, 0], points: [0, 0],
    setsWon: [0, 0], gameServer: match.rules.firstServer,
    server: match.rules.firstServer, tiebreak: false, finished: false, winner: null,
    pointCount: effective.length, history: effective
  };
  for (const event of effective) {
    if (![0, 1].includes(event.side)) throw new Error('Ungültiges Punktereignis.');
    scoreOnePoint(state, event.side, match.rules);
  }
  state.tiebreak = state.games[0] === 6 && state.games[1] === 6;
  state.server = state.tiebreak
    ? state.gameServer ^ (Math.ceil((state.points[0] + state.points[1]) / 2) % 2)
    : state.gameServer;
  state.score = state.tiebreak ? state.points.map(String) : regularPoints(state.points, Boolean(match.rules.noAd));
  return state;
}

function regularPoints(points, noAd) {
  const [a, b] = points;
  if (!noAd && a >= 3 && b >= 3) {
    if (a === b) return ['40', '40'];
    return a > b ? ['AD', '40'] : ['40', 'AD'];
  }
  const labels = ['0', '15', '30', '40'];
  return [labels[Math.min(3, a)], labels[Math.min(3, b)]];
}

export function awardPoint(match, side) {
  if (![0, 1].includes(side)) throw new RangeError('Ungültige Spielerseite.');
  if (getState(match).finished) throw new Error('Das Match ist beendet.');
  return { ...match, events: [...match.events, { id: crypto.randomUUID(), kind: 'point', side, at: new Date().toISOString() }] };
}

export function undoPoint(match) {
  const revoked = new Set(match.events.filter(e => e.kind === 'revoke').map(e => e.target));
  const last = [...match.events].reverse().find(e => e.kind === 'point' && !revoked.has(e.id));
  if (!last) return match;
  return { ...match, events: [...match.events, { id: crypto.randomUUID(), kind: 'revoke', target: last.id, at: new Date().toISOString() }] };
}

export function setCells(state) {
  return [0, 1].map(side => [...state.completedSets.map(s => s.games[side]), state.games[side]]);
}
