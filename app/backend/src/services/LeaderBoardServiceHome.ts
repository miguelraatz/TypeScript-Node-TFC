import sequelize = require('sequelize');
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import sortedResult from '../utils/sortedLeaderBoard';
import ILeaderBoard from '../interfaces/leaderboard/ILeaderBoard';

export default class LeaderBoardServiceHome {
  constructor(
    private teamsModel = SequelizeTeams,
    private matchModel = SequelizeMatches,
  ) { }

  public async findMatchesHome(id: number) {
    const matches = await this.matchModel.findAll({
      where: {
        inProgress: false,
        homeTeamId: id,
      },
      raw: true,
    });
    return matches;
  }

  public async goalsFavorHome(id: number) {
    const sumGoals = await this.matchModel.findAll({
      where: {
        inProgress: false,
        homeTeamId: id,
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('home_team_goals')), 'homeTeamGoals']],
      raw: true,
    });
    return sumGoals;
  }

  public async goalsOwnHome(id: number) {
    const sumGoals = await this.matchModel.findAll({
      where: {
        inProgress: false,
        homeTeamId: id,
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('away_team_goals')), 'awayTeamGoals']],
      raw: true,
    });
    return sumGoals;
  }

  public async totalPointsHome(id: number) {
    const matches = await this.findMatchesHome(id);
    return matches.reduce((acc, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) return acc + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
      return acc + 0;
    }, 0);
  }

  public async totalGamesHome(id: number) {
    const matches = await this.findMatchesHome(id);
    return matches.map((match) => match).length;
  }

  public async totalVDLHome(id: number) {
    const matches = await this.findMatchesHome(id);
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;
    matches.reduce((acc, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) totalVictories += 1;
      if (match.homeTeamGoals === match.awayTeamGoals) totalDraws += 1;
      if (match.homeTeamGoals < match.awayTeamGoals) totalLosses += 1;
      return acc;
    }, 0);
    return { totalVictories, totalDraws, totalLosses };
  }

  public async getData() {
    const getTeams = await this.teamsModel.findAll();
    return Promise.all(getTeams.map(async (team) => {
      const totalPoints = await this.totalPointsHome(team.id);
      const totalGames = await this.totalGamesHome(team.id);
      const [{ homeTeamGoals }] = await this.goalsFavorHome(team.id);
      const [{ awayTeamGoals }] = await this.goalsOwnHome(team.id);
      const { totalVictories, totalDraws, totalLosses } = await this.totalVDLHome(team.id);
      return {
        name: team.teamName,
        totalPoints,
        totalGames,
        homeTeamGoals,
        awayTeamGoals,
        totalVictories,
        totalDraws,
        totalLosses,
      };
    }));
  }

  public async leaderBoardHome() {
    const allDatas = await this.getData();
    const result = allDatas.map((team) => ({
      name: team.name,
      totalPoints: team.totalPoints,
      totalGames: team.totalGames,
      totalVictories: team.totalVictories,
      totalDraws: team.totalDraws,
      totalLosses: team.totalLosses,
      goalsFavor: Number(team.homeTeamGoals),
      goalsOwn: Number(team.awayTeamGoals),
      goalsBalance: Number(team.homeTeamGoals) - Number(team.awayTeamGoals),
      efficiency: ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
    }));
    return sortedResult(result as ILeaderBoard[]);
  }
}
