import ILeaderBoard from '../interfaces/leaderboard/ILeaderBoard';

export default function sortedResult(data: ILeaderBoard[]) {
  const sorted = data.sort((teamA, teamB) => {
    if (teamB.totalPoints === teamA.totalPoints) {
      if (teamB.goalsBalance === teamA.goalsBalance) {
        return teamB.goalsFavor - teamA.goalsFavor;
      }
      return teamB.goalsBalance - teamA.goalsBalance;
    }
    return teamB.totalPoints - teamA.totalPoints;
  });
  return sorted;
}
