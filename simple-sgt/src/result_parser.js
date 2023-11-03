const fs = require('fs');

// https://simulatorgolftour.com/sig_scores.json

const local = process.env.IS_LOCAL === 'true';
console.log('is local: ', local);
const importFilePath = local ? './data/import.json' : '/data/import.json';
const resultFilePath = local ? './data/results.json' : '/data/results.json';

const pointsForPlacement = [50,40,32,25,20,16,13,11,9,8,7,6,5,4,3,2,1];

function readSgtExportData() {
  return fs.readFileSync(importFilePath, 'utf8');
}

function doStuff() {
  readSgtExportDataAndWriteResults();
  const tournaments = getTournamentsFromData();
  const tournament = Object.keys(tournaments).map(tournamentId => tournaments[tournamentId])[2];
  console.log(tournament);
}
doStuff();

function calculatePositionsForTournament(tournament, type) {
  const sortedPlayers = getLeaderboardForTournament(tournament, type);
  let previousPosition = undefined;
  sortedPlayers.forEach((player, index) => {
    let position = undefined;
    const score = player[type];
    const previousPlayer = sortedPlayers[index - 1];
    const previousScore = previousPlayer ? previousPlayer[type] : undefined;
    const nextPlayer = sortedPlayers[index + 1];
    const nextScore = nextPlayer ? nextPlayer[type] : undefined;

    if (index === 0) {
      if (nextPlayer && score === nextScore) {
        position = 'T1';
      } else {
        position = '1';
      }
    } else if (score !== nextScore && score !== previousScore) {
      position = (index + 1).toString();
    } else if (score === previousScore) {
      position = previousPosition;
    } else {
      position = 'T' + (index + 1);
    }
    tournament.playerRounds[player.id][type + 'Position'] = position;
    previousPosition = position;
  });
}

function calculatePointsForTournament(tournament, type) {
  const sortedPlayers = getLeaderboardForTournament(tournament, type).filter(hasPlayedBothRounds);
  for (let i = 0; i < sortedPlayers.length; ) {
    const player = sortedPlayers[i];
    const score = player[type];

    const playersWithScore = getPlayersWithSameScore(sortedPlayers, type, score);
    for (let j = 0; j < playersWithScore.length; j++) {
      const playerWithScore = playersWithScore[j];
      const pointsSlice = pointsForPlacement.slice(i, i + playersWithScore.length);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const totalPoints = pointsSlice.reduce(reducer, 0);
      const points = Math.round(totalPoints / playersWithScore.length);
      tournament.playerRounds[playerWithScore.id][type + 'Points'] = points;
    }
    i += playersWithScore.length;
  }
}

function hasPlayedBothRounds(player) {
  return player.rounds && player.rounds.length === 2 && player.rounds[0].activeHole == 19 && player.rounds[1].activeHole == 19;
}

function getPlayersWithSameScore(players, type, score) {
  return players.filter(player => player[type] === score);
}

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
  calculatePositionsForTournaments(tournaments);
  calculatePointsForTournaments(tournaments);
  return tournaments;
}

function calculatePointsForTournaments(tournaments) {
  Object.keys(tournaments).forEach(tournamentId => {
    const tournament = tournaments[tournamentId];
    calculatePointsForTournament(tournament, 'gross');
    calculatePointsForTournament(tournament, 'net');
  });
}

function calculatePositionsForTournaments(tournaments) {
  Object.keys(tournaments).forEach(tournamentId => {
    const tournament = tournaments[tournamentId];
    calculatePositionsForTournament(tournament, 'gross');
    calculatePositionsForTournament(tournament, 'net');
  });
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
    pars: getParsFromScorecard(scoreCard),
    indexes: getIndexesFromScorecard(scoreCard),
    par: scoreCard.total_par,
    playerRounds: {}
  }
}

function getIndexesFromScorecard(scoreCard) {
  return [
    toInt(scoreCard.h1_index),
    toInt(scoreCard.h2_index),
    toInt(scoreCard.h3_index),
    toInt(scoreCard.h4_index),
    toInt(scoreCard.h5_index),
    toInt(scoreCard.h6_index),
    toInt(scoreCard.h7_index),
    toInt(scoreCard.h8_index),
    toInt(scoreCard.h9_index),
    toInt(scoreCard.h10_index),
    toInt(scoreCard.h11_index),
    toInt(scoreCard.h12_index),
    toInt(scoreCard.h13_index),
    toInt(scoreCard.h14_index),
    toInt(scoreCard.h15_index),
    toInt(scoreCard.h16_index),
    toInt(scoreCard.h17_index),
    toInt(scoreCard.h18_index),
  ];
}

function getParsFromScorecard(scoreCard) {
  return [
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
  ];
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

