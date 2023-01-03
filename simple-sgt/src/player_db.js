const fs = require('fs');

const local = process.env.IS_LOCAL === 'true';
console.log('is local: ', local);
const filePath = local ? './sgt_players.json' : '/data/sgt_players.json';

function getPlayers() {
  // does filePath exist?
  if (!fs.existsSync(filePath)) {
    // if not, create it
    fs.writeFileSync(filePath, '{"Fandorm": "17025857253260810"}');
  }

  // read file to users
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
exports.getPlayers = getPlayers;
function savePlayers(players) {
  fs.writeFileSync(filePath, JSON.stringify(players));
}
function getPlayerUid(playerName) {
  const players = getPlayers();
  return players[playerName];
}
exports.getPlayerUid = getPlayerUid;
function setPlayerUid(playerName, playerUid) {
  const players = getPlayers();
  players[playerName] = playerUid;
  savePlayers(players);
}
exports.setPlayerUid = setPlayerUid;
function deletePlayer(playerName) {
  const players = getPlayers();
  delete players[playerName];
  savePlayers(players);
}
exports.deletePlayer = deletePlayer;
