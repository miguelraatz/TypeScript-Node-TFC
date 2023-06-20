import LeaderBoardServiceHome from './LeaderBoardServiceHome';
import LeaderBoardServiceAway from './LeaderBoardServiceAway';
import sortedResult from '../utils/sortedLeaderBoard';
import ILeaderBoard from '../interfaces/leaderboard/ILeaderBoard';

export default class LeaderBoardService {
  constructor(
    private leaderboardHome = new LeaderBoardServiceHome(),
    private leaderboardAway = new LeaderBoardServiceAway(),
  ) { }

  public async getDatasHome() {
    const datasHome = await this.leaderboardHome.leaderBoardHome();
    return Promise.all(datasHome.map((teamHome) => ({
      name: teamHome.name,
      totalPoints: teamHome.totalPoints,
      totalGames: teamHome.totalGames,
      totalVictories: teamHome.totalVictories,
      totalDraws: teamHome.totalDraws,
      totalLosses: teamHome.totalLosses,
      goalsFavor: teamHome.goalsFavor,
      goalsOwn: teamHome.goalsOwn,
      goalsBalance: teamHome.goalsBalance,
      efficiency: teamHome.efficiency,
    })));
  }

  public async getDatasAway() {
    const datasAway = await this.leaderboardAway.leaderBoardAway();
    return Promise.all(datasAway.map((teamAway) => ({
      name: teamAway.name,
      totalPoints: teamAway.totalPoints,
      totalGames: teamAway.totalGames,
      totalVictories: teamAway.totalVictories,
      totalDraws: teamAway.totalDraws,
      totalLosses: teamAway.totalLosses,
      goalsFavor: teamAway.goalsFavor,
      goalsOwn: teamAway.goalsOwn,
      goalsBalance: teamAway.goalsBalance,
      efficiency: teamAway.efficiency,
    })));
  }

  public async getDatas() {
    const homeData = await this.getDatasHome();
    const awayData = await this.getDatasAway();
    return Promise.all(homeData.map(async (teamHome) => {
      const findAwayTeam = awayData.find((teamAway) => teamHome.name === teamAway.name);
      if (!findAwayTeam) return null;
      const { name } = teamHome;
      const totalVictories = teamHome.totalVictories + findAwayTeam.totalVictories;
      const totalDraws = teamHome.totalDraws + findAwayTeam.totalDraws;
      const totalLosses = teamHome.totalLosses + findAwayTeam.totalLosses;
      return { name, totalVictories, totalDraws, totalLosses };
    }));
  }

  public async getGoals() {
    const homeData = await this.getDatasHome();
    const awayData = await this.getDatasAway();
    return Promise.all(homeData.map(async (teamHome) => {
      const findAwayTeam = awayData.find((teamAway) => teamHome.name === teamAway.name);
      if (!findAwayTeam) return null;
      const totalPoints = teamHome.totalPoints + findAwayTeam.totalPoints;
      const totalGames = teamHome.totalGames + findAwayTeam.totalGames;
      const goalsFavor = teamHome.goalsFavor + findAwayTeam.goalsFavor;
      const goalsOwn = teamHome.goalsOwn + findAwayTeam.goalsOwn;
      const goalsBalance = goalsFavor - goalsOwn;
      const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
      return { totalPoints, totalGames, goalsFavor, goalsOwn, goalsBalance, efficiency };
    }));
  }

  public async leaderBoard() {
    const getDatas = await this.getDatas();
    const getGoals = await this.getGoals();
    const result = getDatas.map((team, index) => {
      const goals = getGoals.map((goalsData) => goalsData);
      return {
        name: team?.name,
        totalPoints: goals[index]?.totalPoints,
        totalGames: goals[index]?.totalGames,
        totalVictories: team?.totalVictories,
        totalDraws: team?.totalDraws,
        totalLosses: team?.totalLosses,
        goalsFavor: goals[index]?.goalsFavor,
        goalsOwn: goals[index]?.goalsOwn,
        goalsBalance: goals[index]?.goalsBalance,
        efficiency: goals[index]?.efficiency,
      };
    });
    return sortedResult(result as ILeaderBoard[]);
  }
}
