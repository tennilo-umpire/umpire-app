/* Source fingerprint MW-TNU-2026-d950c68a | Copyright (c) 2026 Michael Wiedeck. All rights reserved. */
import { newMatch, awardPoint, undoPoint, getState } from './scoring.js';
import { MATCH_KEY, loadMatch, saveMatch } from './storage.js';
const $ = id => document.getElementById(id);
let match = loadMatch();
if (!match || match.version !== 1) { match = newMatch(); saveMatch(match); }
let mode = localStorage.getItem('tennilo-umpire:mode') === 'pro' ? 'pro' : 'basic';
function paint() {
  let state;
  try { state = getState(match); } catch { match = newMatch(); saveMatch(match); state = getState(match); }
  $('match-title').textContent = state.players.join(' · ');
  $('match-format').textContent = `Best of ${match.rules.bestOf}${match.rules.noAd ? ' · No-Ad' : ''}`;
  for (let i=0;i<2;i++) {
    $('name-'+i).textContent = state.players[i];
    $('award-label-'+i).textContent = state.players[i];
    $('serve-'+i).style.visibility = state.server === i && !state.finished ? 'visible' : 'hidden';
    $('sets-'+i).textContent = state.setsWon[i];
    $('games-'+i).textContent = state.games[i];
    $('points-'+i).textContent = state.score[i];
    $('award-'+i).disabled = state.finished;
  }
  $('game-type').textContent = state.finished ? 'Match beendet' : state.tiebreak ? 'Tie-Break' : 'Reguläres Spiel';
  $('sets-detail').textContent = state.completedSets.length ? state.completedSets.map((s,j)=>`Satz ${j+1}: ${s.games.join(':')}`).join(' · ') : 'Noch kein Satz abgeschlossen';
  $('point-count').textContent = match.events.filter(e=>e.kind==='point').length;
  $('revoke-count').textContent = match.events.filter(e=>e.kind==='revoke').length;
  const logs = match.events.slice(-40).reverse();
  $('history').replaceChildren(...(logs.length ? logs.map(e=>{
    const li=document.createElement('li');
    const when = new Date(e.at).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    li.textContent = e.kind==='point' ? `${when} · Punkt ${match.players[e.side]}` : `${when} · Korrektur (Punkt zurückgenommen)`;
    return li;
  }) : [Object.assign(document.createElement('li'),{textContent:'Noch keine Punkte erfasst.'})]));
  $('match-end').hidden = !state.finished;
  if(state.finished) $('match-end').textContent = `Match beendet · Sieger: ${state.players[state.winner]}`;
  $('undo').disabled = !match.events.some(e=>e.kind==='point' && !match.events.some(r=>r.kind==='revoke'&&r.target===e.id));
  document.querySelectorAll('[data-mode]').forEach(b=>{const s=b.dataset.mode===mode;b.classList.toggle('selected',s);b.setAttribute('aria-pressed',String(s));});
  $('pro-panel').hidden = mode!=='pro';
  $('match-clock').textContent = new Date(Date.now()-new Date(match.createdAt).getTime()).toISOString().substring(11,19);
}
function commit(next){match=next;saveMatch(match);paint();}
for(let i=0;i<2;i++) $('award-'+i).addEventListener('click',()=>{try{commit(awardPoint(match,i))}catch(e){alert(e.message)}});
$('undo').addEventListener('click',()=>commit(undoPoint(match)));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;localStorage.setItem('tennilo-umpire:mode',mode);paint()}));
$('new-match').addEventListener('click',()=>$('match-dialog').showModal());
$('close-dialog').addEventListener('click',()=>$('match-dialog').close());
$('match-form').addEventListener('submit',e=>{
  e.preventDefault();
  const values=new FormData(e.currentTarget);
  try {commit(newMatch({playerA:values.get('playerA'),playerB:values.get('playerB'),bestOf:Number(values.get('bestOf')),firstServer:Number(values.get('firstServer')),noAd:values.has('noAd')}));$('match-dialog').close()}
  catch(err){alert(err.message)}
});
window.addEventListener('storage',e=>{if(e.key===MATCH_KEY){const next=loadMatch();if(next){match=next;paint()}}});
setInterval(()=>{if(match) $('match-clock').textContent=new Date(Date.now()-new Date(match.createdAt).getTime()).toISOString().substring(11,19)},1000);
paint();
