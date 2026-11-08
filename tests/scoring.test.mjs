import test from 'node:test';
import assert from 'node:assert/strict';
import { newMatch, awardPoint, undoPoint, getState } from '../public/js/scoring.js';

function winPoints(m, side, count) { for(let i=0;i<count;i++) m=awardPoint(m,side);return m; }
function winGame(m, side) { return winPoints(m, side, 4); }

test('15/30/40, game and service switch', () => {
  let m = newMatch({playerA:'Ana', playerB:'Ben'});
  m = awardPoint(m,0);
  assert.deepEqual(getState(m).score,['15','0']);
  m = winPoints(m,0,3);
  assert.deepEqual(getState(m).games,[1,0]);
  assert.equal(getState(m).server,1);
});

test('deuce/advantage, then game', () => {
  let m = newMatch(); m=winPoints(m,0,3);m=winPoints(m,1,3);
  assert.deepEqual(getState(m).score,['40','40']);
  m=awardPoint(m,0);assert.deepEqual(getState(m).score,['AD','40']);
  m=awardPoint(m,1);assert.deepEqual(getState(m).score,['40','40']);
  m=winPoints(m,0,2);assert.deepEqual(getState(m).games,[1,0]);
});

test('no-ad deciding point', () => {
  let m=newMatch({noAd:true});m=winPoints(m,0,3);m=winPoints(m,1,3);
  m=awardPoint(m,1);assert.deepEqual(getState(m).games,[0,1]);
});

test('set to 6-4 and match finish best of 3', () => {
  let m=newMatch();
  for(let i=0;i<2;i++){
    for(let j=0;j<4;j++)m=winGame(m,0);
    for(let j=0;j<4;j++)m=winGame(m,1);
    for(let j=0;j<2;j++)m=winGame(m,0);
  }
  assert.deepEqual(getState(m).completedSets.map(s=>s.games),[[6,4],[6,4]]);
  assert.equal(getState(m).finished,true);
  assert.throws(()=>awardPoint(m,0));
});

test('6-6 tiebreak: server alternates 1,2,2,2... and 7-5 finish', () => {
  let m=newMatch();
  for(let i=0;i<6;i++){m=winGame(m,0);m=winGame(m,1);}
  assert.equal(getState(m).tiebreak,true);
  const first = getState(m).server;
  m=awardPoint(m,0); assert.equal(getState(m).server,1-first);
  m=awardPoint(m,1); assert.equal(getState(m).server,1-first);
  m=awardPoint(m,0); assert.equal(getState(m).server,first);
  for(let i=0;i<4;i++){m=awardPoint(m,0);m=awardPoint(m,1);}
  m=awardPoint(m,0); m=awardPoint(m,0);
  assert.deepEqual(getState(m).completedSets[0].games,[7,6]);
  assert.equal(getState(m).server,1-first);
});

test('undo is journalled and replays from scratch, even after match end', () => {
  let m=newMatch();m=winPoints(m,0,4);
  assert.deepEqual(getState(m).games,[1,0]);
  m=undoPoint(m);
  assert.deepEqual(getState(m).games,[0,0]);
  assert.deepEqual(getState(m).score,['40','0']);
  assert.equal(m.events.at(-1).kind,'revoke');
});
