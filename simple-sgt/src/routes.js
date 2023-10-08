const playersPages = require('./html/players.js');
const path = require('path');
const { getPlayers, getPlayerUid, deletePlayer, setPlayerUid } = require("./player_db.js");

function getRoutes(app) {
  app.get("/players", (req, res) => {
    res.send(playersPages.getPlayersPage(getPlayers()));
  });
  
  app.get("/players/add", (req, res) => {
    res.send(playersPages.addPlayerPage());
  });
  
  app.get("/players/edit/:playername", (req, res) => {
    // get player name from url param
    const name = req.params['playername'];
    res.send(playersPages.editPlayerPage(name, getPlayerUid(name)));
  });
  
  // add post to delete player
  app.post("/players/delete", (req, res) => {
    const name = req.body['name'];
    deletePlayer(name);
    res.redirect('/players');
  });
  
  app.post("/players/write", (req, res) => {
    setPlayerUid(req.body['name'], req.body['uid']);
    res.redirect('/players');
  });

  app.get("/teetime/*", (req, res) => {
    res.sendFile(path.resolve('./public/teetime', 'index.html'));
  });
  
  app.get("/uid/:name", (req, res) => {
    const name = req.params["name"];
    const uid = getPlayerUid(name);
    if (uid) {
      res.send(uid);
    } else {
      res.send('no user: ' + name);
    }
  });
}
module.exports = { getRoutes };
