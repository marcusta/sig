const fs = require('fs');

const local = process.env.IS_LOCAL === 'true';
console.log('is local: ', local);
const importFilePath = local ? './data/import.json' : '/data/import.json';
const resultFilePath = local ? './data/results.json' : '/data/results.json';

function readSgtExportData() {
  return fs.readFileSync(importFilePath, 'utf8');
}

const pointsForPlacement = [50,40,32,25,20,16,13,11,9,8,7,6,5,4,3,2,1];

/**
 * 
 * @returns {Promise<FullScoreCard[]>}
 */
function getScoreCardsFromData() {
  const data = readSgtExportData();
  const scoreCards = JSON.parse(data);
  return scoreCards;
}

function getTournamentsFromData() {
  const string = fs.readFileSync(resultFilePath, 'utf8');
  return JSON.parse(string);
}

function readSgtExportDataAndWriteResults() {
  const tournaments = readTournaments();
  writeTournamentsToFile(tournaments);
}

function doStuff() {
  readSgtExportDataAndWriteResults();
  const start = new Date().getTime();
  const tournaments = getTournamentsFromData();
  printTournaments(tournaments);
  console.log('read tournaments from file: ', new Date().getTime() - start);
}
doStuff();

function printLeaderboard(tournament, type = 'net') {
  const sortedPlayers = getLeaderboardForTournament(tournament, type);
  console.log(`${tournament.name} ${type.toUpperCase()} results: \n${sortedPlayers.map((player) => `${player.place}. ${player.name}, ${player.handicap} - ${player[type]}`).join('\n')}`);
  console.log('---------------------------------\n');
}

function getLeaderboardForTournament(tournament, type = 'net') {
  const playerRounds = tournament.playerRounds;
  const playerIds = Object.keys(playerRounds);
  const players = playerIds.map(playerId => playerRounds[playerId]);
  const sortedPlayers = players.sort((a, b) => a[type] - b[type]).map((player, index) => {
    return {
      ...player,
      place: index + 1
    }
  });
  return sortedPlayers;
}

function printTournaments(tournaments) {
  Object.keys(tournaments).forEach(tournamentId => {
    printLeaderboard(tournaments[tournamentId], 'gross');
    printLeaderboard(tournaments[tournamentId], 'net');
  });
}

function writeTournamentsToFile(tournaments) {
  fs.writeFileSync(resultFilePath, JSON.stringify(tournaments));
}

function readTournaments() {
  const scoreCards = getScoreCardsFromData();
  console.log('scoreCards: ', scoreCards.length);
  const tournaments = {};
  scoreCards.forEach(scoreCard => {
    if (!tournaments[scoreCard.tournamentId]) {
      tournaments[scoreCard.tournamentId] = mapFullScoreCardToTournament(scoreCard);
    }
  });
  addScoresToTournaments(tournaments, scoreCards);
  sumScoresForTournaments(tournaments);
  return tournaments;
}

function addScoresToTournaments(tournaments, scoreCards) {
  scoreCards.forEach(scoreCard => {
    const tournament = tournaments[scoreCard.tournamentId];
    addPlayerRound(tournament, scoreCard);
  });
}

function sumScoresForTournaments(tournaments) {
  console.log('summing scores for tournaments');
  Object.keys(tournaments).forEach(tournamentId => {  
    const tournament = tournaments[tournamentId];
    sumScoresForTournament(tournament);
  });
}

function sumScoresForTournament(tournament) {
  Object.keys(tournament.playerRounds).forEach(playerId => {
    const playerRounds = tournament.playerRounds[playerId];    
    playerRounds.rounds.forEach((round) => {
      playerRounds.gross += round.gross.toPar;
      playerRounds.net += round.net.toPar;
    });
  });
  
}

function addPlayerRound(tournament, scoreCard) {
  const round = mapFullScoreCardToTournamentRound(scoreCard);
  if (!tournament.playerRounds[scoreCard.playerId]) {
    tournament.playerRounds[scoreCard.playerId] = {
      name: scoreCard.player_name,
      id: scoreCard.playerId,
      handicap: toInt(scoreCard.hcp_index),
      gross: 0,
      net: 0,
      rounds: []
    };
  }
  const playerRounds = tournament.playerRounds[scoreCard.playerId];
  playerRounds.rounds.push(round);
}

/**
 * 
 * @param {Object} scoreCard 
 * @returns {Object} Tournament
 */
function mapFullScoreCardToTournament(scoreCard) {
  return {
    id: scoreCard.tournamentId,
    name: scoreCard.TourneyName,
    pars: [
      toInt(scoreCard.h1_Par),
      toInt(scoreCard.h2_Par),
      toInt(scoreCard.h3_Par),
      toInt(scoreCard.h4_Par),
      toInt(scoreCard.h5_Par),
      toInt(scoreCard.h6_Par),
      toInt(scoreCard.h7_Par),
      toInt(scoreCard.h8_Par),
      toInt(scoreCard.h9_Par),
      toInt(scoreCard.h10_Par),
      toInt(scoreCard.h11_Par),
      toInt(scoreCard.h12_Par),
      toInt(scoreCard.h13_Par),
      toInt(scoreCard.h14_Par),
      toInt(scoreCard.h15_Par),
      toInt(scoreCard.h16_Par),
      toInt(scoreCard.h17_Par),
      toInt(scoreCard.h18_Par),
    ],
    indexes: [
      toInt(scoreCard.h1_Index),
      toInt(scoreCard.h2_Index),
      toInt(scoreCard.h3_Index),
      toInt(scoreCard.h4_Index),
      toInt(scoreCard.h5_Index),
      toInt(scoreCard.h6_Index),
      toInt(scoreCard.h7_Index),
      toInt(scoreCard.h8_Index),
      toInt(scoreCard.h9_Index),
      toInt(scoreCard.h10_Index),
      toInt(scoreCard.h11_Index),
      toInt(scoreCard.h12_Index),
      toInt(scoreCard.h13_Index),
      toInt(scoreCard.h14_Index),
      toInt(scoreCard.h15_Index),
      toInt(scoreCard.h16_Index),
      toInt(scoreCard.h17_Index),
      toInt(scoreCard.h18_Index),
    ],
    par: scoreCard.total_par,
    playerRounds: {}
  }
}

/** 
 * @param {object} FullScoreCard 
 * @returns {Object} Round
 * */
function mapFullScoreCardToTournamentRound(scoreCard) {
  return {
    scoreId: scoreCard.tournamentScorecardId,
    activeHole: toInt(scoreCard.activeHole),
    round: toInt(scoreCard.round),
    date: scoreCard.registration_date,
    status: scoreCard.status,
    net: {
      in: toInt(scoreCard.in_net),
      out: toInt(scoreCard.out_net),
      total: toInt(scoreCard.total_net),
      toPar: toInt(scoreCard.toPar_net),
      holes: [
        toInt(scoreCard.hole1_net),
        toInt(scoreCard.hole2_net),
        toInt(scoreCard.hole3_net),
        toInt(scoreCard.hole4_net),
        toInt(scoreCard.hole5_net),
        toInt(scoreCard.hole6_net),
        toInt(scoreCard.hole7_net),
        toInt(scoreCard.hole8_net),
        toInt(scoreCard.hole9_net),
        toInt(scoreCard.hole10_net),
        toInt(scoreCard.hole11_net),
        toInt(scoreCard.hole12_net),
        toInt(scoreCard.hole13_net),
        toInt(scoreCard.hole14_net),
        toInt(scoreCard.hole15_net),
        toInt(scoreCard.hole16_net),
        toInt(scoreCard.hole17_net),
        toInt(scoreCard.hole18_net),
      ]
    },
    gross: {
      in: toInt(scoreCard.in_gross),
      out: toInt(scoreCard.out_gross),
      total: toInt(scoreCard.total_gross),
      toPar: toInt(scoreCard.toPar_gross),
      holes: [
        toInt(scoreCard.hole1_gross),
        toInt(scoreCard.hole2_gross),
        toInt(scoreCard.hole3_gross),
        toInt(scoreCard.hole4_gross),
        toInt(scoreCard.hole5_gross),
        toInt(scoreCard.hole6_gross),
        toInt(scoreCard.hole7_gross),
        toInt(scoreCard.hole8_gross),
        toInt(scoreCard.hole9_gross),
        toInt(scoreCard.hole10_gross),
        toInt(scoreCard.hole11_gross),
        toInt(scoreCard.hole12_gross),
        toInt(scoreCard.hole13_gross),
        toInt(scoreCard.hole14_gross),
        toInt(scoreCard.hole15_gross),
        toInt(scoreCard.hole16_gross),
        toInt(scoreCard.hole17_gross),
        toInt(scoreCard.hole18_gross),
      ]
    },
  }
}

function toInt(num) {
  if (num) {
    try {
      return parseInt(num);
    } catch(e) {
      return 0;
    }
  }
  return 0;
}

/**
 * @typedef {Object} PlayerRounds
 * @property {string} playerId
 * @property {string} playerName
 * @property {string} handicap
 * @property {number} net
 * @property {number} gross
 * @property {Round[]} rounds
 */

/**
 * @typedef {Object} Round
 * @property {string} scoreId
 * @property {string} activeHole
 * @property {string} round
 * @property {string} date
 * @property {Net} net
 * @property {Gross} gross
 * @property {string} status
 */

/**
 * @typedef {Object} Tournament
 * @property {string} id
 * @property {string} name
 * @property {number[]} pars
 * @property {number[]} indexes
 * @property {number} par
 * @property {PlayerRounds} playerRounds
 */

/**
 * @typedef {Object} FullScoreCard
  * @property {string} tournamentId
  * @property {string} TourneyName
  * @property {string} playerId
  * @property {string} player_name
  * @property {string} hcp_index
  * @property {string} registration_date
  * @property {string} status
  * @property {string} tournamentScorecardId
  * @property {string} registrationId
  * @property {string} round
  * @property {string} activeHole
  * @property {string} hole1_gross
  * @property {string} hole1_net
  * @property {string} hole2_gross
  * @property {string} hole2_net
  * @property {string} hole3_gross
  * @property {string} hole3_net
  * @property {string} hole4_gross
  * @property {string} hole4_net
  * @property {string} hole5_gross
  * @property {string} hole5_net
  * @property {string} hole6_gross
  * @property {string} hole6_net
  * @property {string} hole7_gross
  * @property {string} hole7_net
  * @property {string} hole8_gross
  * @property {string} hole8_net
  * @property {string} hole9_gross
  * @property {string} hole9_net
  * @property {string} hole10_gross
  * @property {string} hole10_net
  * @property {string} hole11_gross
  * @property {string} hole11_net
  * @property {string} hole12_gross
  * @property {string} hole12_net
  * @property {string} hole13_gross
  * @property {string} hole13_net
  * @property {string} hole14_gross
  * @property {string} hole14_net
  * @property {string} hole15_gross
  * @property {string} hole15_net
  * @property {string} hole16_gross
  * @property {string} hole16_net
  * @property {string} hole17_gross
  * @property {string} hole17_net
  * @property {string} hole18_gross
  * @property {string} hole18_net
  * @property {string} in_gross
  * @property {string} out_gross
  * @property {string} in_net
  * @property {string} out_net
  * @property {string} total_gross
  * @property {string} toPar_gross
  * @property {string} total_net
  * @property {string} toPar_net
  * @property {string} h1_Par
  * @property {string} h2_Par
  * @property {string} h3_Par
  * @property {string} h4_Par
  * @property {string} h5_Par
  * @property {string} h6_Par
  * @property {string} h7_Par
  * @property {string} h8_Par
  * @property {string} h9_Par
  * @property {string} h10_Par
  * @property {string} h11_Par
  * @property {string} h12_Par
  * @property {string} h13_Par
  * @property {string} h14_Par
  * @property {string} h15_Par
  * @property {string} h16_Par
  * @property {string} h17_Par
  * @property {string} h18_Par
  * @property {string} h1_index
  * @property {string} h2_index
  * @property {string} h3_index
  * @property {string} h4_index
  * @property {string} h5_index
  * @property {string} h6_index
  * @property {string} h7_index
  * @property {string} h8_index
  * @property {string} h9_index
  * @property {string} h10_index
  * @property {string} h11_index
  * @property {string} h12_index
  * @property {string} h13_index
  * @property {string} h14_index
  * @property {string} h15_index
  * @property {string} h16_index
  * @property {string} h17_index
  * @property {string} h18_index
  * @property {string} total_par
 */

