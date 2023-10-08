import { Tournament, ResultType, PlayerRounds } from "./TournamentDataTypes";

export function getSortedPlayers(
  tournament: Tournament,
  type: ResultType
): PlayerRounds[] {
  const playerRounds = tournament.playerRounds;
  const playerIds = Object.keys(playerRounds);
  if (!playerIds || playerIds.length === 0) return [];

  const players = playerIds.map((playerId) => playerRounds[playerId]);
  const sortedPlayers = players
    .sort((a, b) => a[type] - b[type])
    .map((player, index) => {
      return {
        ...player,
        place: index + 1,
      };
    });
  return sortedPlayers;
}

export function getLeaderForTournament(
  tournament: Tournament,
  type: ResultType
): string {
  const sortedPlayers = getSortedPlayers(tournament, type);
  const leader = sortedPlayers[0];
  return `${leader.name}, ${leader[type]}`;
}
