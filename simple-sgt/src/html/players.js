const { wrapDoc, formField, submitButton } = require("./helpers.js");

function getPlayersPage(players) {
  let html = '<table class="table is-hoverable"><thead><tr><th>Name</th><th></th></tr></thead><tbody>';
  for (const name in players) {
    html += `<tr><td>${name}</td><td><a href="/players/edit/${name}">Edit</a></td></tr>`;
  }
  html += `</table>
  <form action="/players/add">
    <input type="submit" class="is-link button" value="Create Player" />
  </form>`;
  return wrapDoc('Players', html);
}

function addPlayerPage() {
  let html = `<form action="/players/write" method="post">
  ${formField('Name', 'name',  '')}
  ${formField('UID', 'uid',  '')}
  <input class="button" type="submit" value="Add Player">
  <br><p><a href="/Players">Back</a></p>  
  </form>`;
  return wrapDoc('Add Player', html);
}

function editPlayerPage(playerName, playerUid) {
  let html = `<form style="display:inline;" action="/players/write" method="post">
  <input type="hidden" id="name" name="name" value="${playerName}">
  ${formField('UID', 'uid',  playerUid)}
  ${submitButton('Update Player')}
  </form>
  <form style="display:inline;" action="/players/delete" method="post">
    <input type="hidden" id="name" name="name" value="${playerName}">
    <input class="button" type="submit" value="Delete Player">
  </form>
  <br><p><a href="/Players">Back</a></p>`;
  return wrapDoc(playerName, html);
}

module.exports = {getPlayersPage, addPlayerPage, editPlayerPage};