import { getState } from './scoring.js';
import { MATCH_KEY, loadMatch } from './storage.js';
const $=id=>document.getElementById(id);
function paint(){
 const match=loadMatch();if(!match)return;
 try{
 const state=getState(match);
 for(let i=0;i<2;i++){ $('display-name-'+i).textContent=state.players[i];$('display-sets-'+i).textContent=state.setsWon[i];$('display-games-'+i).textContent=state.games[i];$('display-points-'+i).textContent=state.score[i]; }
 $('display-format').textContent=`Best of ${match.rules.bestOf}${state.tiebreak?' · Tie-Break':''}`;
 $('display-serve').textContent=state.finished?'Match beendet':`Aufschlag: ${state.players[state.server]}`;
 $('display-finished').hidden=!state.finished;
 if(state.finished)$('display-finished').textContent=`Sieger: ${state.players[state.winner]}`;
 }catch(e){console.error('Lokaler Matchstand konnte nicht geladen werden.',e)}
}
window.addEventListener('storage',e=>{if(e.key===MATCH_KEY)paint()});
window.addEventListener('focus',paint);
setInterval(paint,1500);
paint();
