import sequelize = require('sequelize');
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import sortedResult from '../utils/sortedLeaderBoard';
import ILeaderBoard from '../interfaces/leaderboard/ILeaderBoard';

export default class LeaderBoardServiceAway {
  constructor(
    private teamsModel = SequelizeTeams,
    private matchModel = SequelizeMatches,
  ) { }

  public async findMatchesAway(id: number) {
    const matches = await this.matchModel.findAll({
      where: {
        inProgress: false,
        awayTeamId: id,
      },
      raw: true,
    });
    return matches;
  }

  public async goalsFavorAway(id: number) {
    const sumGoals = await this.matchModel.findAll({
      where: {
        inProgress: false,
        awayTeamId: id,
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('away_team_goals')), 'homeTeamGoals']],
      raw: true,
    });
    return sumGoals;
  }

  public async goalsOwnAway(id: number) {
    const sumGoals = await this.matchModel.findAll({
      where: {
        inProgress: false,
        awayTeamId: id,
      },
      attributes: [[sequelize.fn('SUM', sequelize.col('home_team_goals')), 'awayTeamGoals']],
      raw: true,
    });
    return sumGoals;
  }

  public async totalPointsAway(id: number) {
    const matches = await this.findMatchesAway(id);
    return matches.reduce((acc, match) => {
      if (match.awayTeamGoals > match.homeTeamGoals) return acc + 3;
      if (match.awayTeamGoals === match.homeTeamGoals) return acc + 1;
      return acc + 0;
    }, 0);
  }

  public async totalGamesAway(id: number) {
    const matches = await this.findMatchesAway(id);
    return matches.map((match) => match).length;
  }

  public async totalVDLAway(id: number) {
    const matches = await this.findMatchesAway(id);
    let totalVictories = 0;
    let totalDraws = 0;
    let totalLosses = 0;
    matches.reduce((acc, match) => {
      if (match.awayTeamGoals > match.homeTeamGoals) totalVictories += 1;
      if (match.awayTeamGoals === match.homeTeamGoals) totalDraws += 1;
      if (match.awayTeamGoals < match.homeTeamGoals) totalLosses += 1;
      return acc;
    }, 0);
    return { totalVictories, totalDraws, totalLosses };
  }

  public async getData() {
    const getTeams = await this.teamsModel.findAll();
    return Promise.all(getTeams.map(async (team) => {
      const totalPoints = await this.totalPointsAway(team.id);
      const totalGames = await this.totalGamesAway(team.id);
      const [{ homeTeamGoals }] = await this.goalsFavorAway(team.id);
      const [{ awayTeamGoals }] = await this.goalsOwnAway(team.id);
      const { totalVictories, totalDraws, totalLosses } = await this.totalVDLAway(team.id);
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

  public async leaderBoardAway() {
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
