import {
  Competition,
  PlayerResult,
  TeeTimeResult,
  Year,
} from "./TeeTimeResultTypes";

export async function fetchData(): Promise<TeeTimeResult> {
  const response = await fetch("/api/teetime.json");
  const data = await response.json();
  return data;
}

function playerAttended(playerNick: string, competition: Competition): boolean {
  return competition.results.some((result) => result.nick === playerNick);
}

function getPlayersWithSameScore(
  playerResults: PlayerResult[],
  result: number
) {
  return playerResults.filter((playerResult) => playerResult.result === result);
}

function extendCompetitionInYearDataWithPlayerResults(yearData: Year) {
  const competitions = yearData.competitions;
  const points = [5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  competitions.forEach((competition) => {
    const sortModifier = competition.type === "Poäng" ? -1 : 1;
    const sortedPlayerResult = competition.results.sort(
      (a, b) => (a.result - b.result) * sortModifier
    );

    let currentPosition = 0;
    for (let i = 0; sortedPlayerResult.length > i; i++) {
      const playerResult = sortedPlayerResult[i];
      const playersWithSameScore = getPlayersWithSameScore(
        sortedPlayerResult,
        playerResult.result
      );

      const pointsForPlayers = points.slice(
        currentPosition,
        currentPosition + playersWithSameScore.length
      );
      // sum points in pointsForPlayers array
      const pointsForPlayersSum = pointsForPlayers.reduce((a, b) => a + b, 0);
      const pointsPerPlayer =
        Math.round((pointsForPlayersSum / playersWithSameScore.length) * 10) /
        10;
      playersWithSameScore.forEach((player) => {
        if (player.dq) {
          player.points = 0;
          player.competitionType = competition.type;
          player.position = sortedPlayerResult.length;
        } else {
          player.position = currentPosition + 1;
          player.points = pointsPerPlayer;
          player.competitionType = competition.type;
          player.countsForDopedHandicap = competition.doped;
        }
      });
      if (playerResult.dq) {
        playersWithSameScore[0].position = sortedPlayerResult.length;
      } else {
        currentPosition += playersWithSameScore.length;
      }
      i += playersWithSameScore.length - 1;
    }
    competition.results = sortedPlayerResult;
  });
}

function getNonCancelledCompetitionCount(yearData: Year): number {
  return yearData.competitions.filter(
    (competition) => !competition.cancelled && competition.results.length > 0
  ).length;
}

function extendPlayersInYearDataWithCompetitionResults(yearData: Year) {
  const players = yearData.players;
  const competitions = yearData.competitions;
  players.forEach((player) => {
    if (player.played === undefined) {
      player.played = 0;
      player.won = 0;
      player.top3 = 0;
      player.top5 = 0;
      player.points = 0;
      player.totalPoints = 0;
      player.meanResult = 0;
      player.meanResultTop10 = 0;
      player.meanPoints = 0;
      player.meanPointsTop10 = 0;
      player.bestResult = 0;
      player.worstResult = 0;
      player.playedPercentage = 0;
      player.dopedHandicap = 0;
    }
    const playerCompetitions: PlayerResult[] = [];
    competitions.forEach((competition) => {
      const playerResult = competition.results.find(
        (result) => result.nick === player.nick
      );
      if (playerResult) {
        playerCompetitions.push(playerResult);
      }
    });
    const sortedPlayerResult = playerCompetitions.sort(
      (a, b) => (a.points - b.points) * -1
    );
    let totalResultPoints = 0;
    let totalResultPointsCount = 0;
    let top10ResultPoints = 0;
    let top10ResultPointsCount = 0;
    let top10Placements = 0;
    let resultsForDopedHandicap = 0;
    let resultsForDopedHandicapCount = 0;

    for (let i = 0; i < sortedPlayerResult.length; i++) {
      const playerResult = sortedPlayerResult[i];
      player.played += 1;
      if (playerResult.position === 1) {
        player.won += 1;
      }
      if (playerResult.position <= 3) {
        player.top3 += 1;
      }
      if (playerResult.position <= 5) {
        player.top5 += 1;
      }
      if (
        playerResult.countsForDopedHandicap &&
        playerResult.competitionType === "Poäng"
      ) {
        resultsForDopedHandicap += playerResult.result;
        resultsForDopedHandicapCount += 1;
      }
      if (playerResult.competitionType === "Poäng") {
        if (player.bestResult < playerResult.result) {
          player.bestResult = playerResult.result;
        }
        if (
          player.worstResult === 0 ||
          player.worstResult > playerResult.result
        ) {
          player.worstResult = playerResult.result;
        }
        totalResultPoints += playerResult.result;
        totalResultPointsCount += 1;
        if (i < 10) {
          top10ResultPoints += playerResult.result;
          top10ResultPointsCount += 1;
        }
      }
      player.totalPoints += playerResult.points;
      if (i < 10) {
        player.points += playerResult.points;
        playerResult.usedForPoints = true;
        top10Placements += 1;
      } else {
        playerResult.usedForPoints = false;
      }
    }
    player.meanResult = totalResultPointsCount
      ? round(totalResultPoints / totalResultPointsCount)
      : 0;
    player.meanResultTop10 = totalResultPointsCount
      ? round(top10ResultPoints / top10ResultPointsCount)
      : 0;
    player.meanPoints = player.played
      ? round(player.totalPoints / player.played)
      : 0;
    player.playedPercentage = getNonCancelledCompetitionCount(yearData)
      ? Math.round(
          (player.played * 100) / getNonCancelledCompetitionCount(yearData)
        )
      : 0;
    player.meanPointsTop10 = top10Placements
      ? round(player.points / top10Placements)
      : 0;
    player.dopedHandicap = resultsForDopedHandicapCount
      ? round((18 - resultsForDopedHandicap / resultsForDopedHandicapCount) * 2)
      : 0;
  });
}

function round(value: number, decimals = 1) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

function getResultsForYear(data: TeeTimeResult, year: number): void {
  const yearData = data.years[year.toString()];

  extendCompetitionInYearDataWithPlayerResults(yearData);
  extendPlayersInYearDataWithCompetitionResults(yearData);

  const players = yearData.players;
  const sortedPlayers = players.sort((a, b) => (a.points - b.points) * -1);
  yearData.players = sortedPlayers;
}

export function calculatePointsAndStandings(
  data: TeeTimeResult
): TeeTimeResult {
  const years = Object.keys(data.years);
  years.forEach((year) => {
    getResultsForYear(data, parseInt(year));
  });
  return data;
}
