import sortedResult from '../utils/sortedLeaderBoard';
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import ILeaderBoard from '../interfaces/leaderboard/ILeaderBoard';

export default class LeaderBoardService {
  constructor(
    private teamsModel = SequelizeTeams,
    private matchModel = SequelizeMatches,
  ) { }

  public async findMatchsTeam(id: number, isHome: string) {
    if (isHome === 'home') {
      const matchsHomeTeam = await this.matchModel.findAll({
        where: { inProgress: false, homeTeamId: id },
      });
      return matchsHomeTeam;
    }
    const matchsHomeTeam = await this.matchModel.findAll({
      where: { inProgress: false, awayTeamId: id },
    });
    return matchsHomeTeam;
  }

  public async totalPointsGamesAndVDL(id: number, isHome: string): Promise<number[]> {
    const matches = await this.findMatchsTeam(id, isHome);
    let vic = 0;
    let draw = 0;
    let loss = 0;
    matches.map((match) => {
      if (isHome === 'away') {
        if (match.awayTeamGoals > match.homeTeamGoals) vic += 1;
        if (match.awayTeamGoals < match.homeTeamGoals) loss += 1;
        if (match.awayTeamGoals === match.homeTeamGoals) draw += 1;
        return 0;
      } if (match.homeTeamGoals > match.awayTeamGoals) vic += 1;
      if (match.homeTeamGoals < match.awayTeamGoals) loss += 1;
      if (match.homeTeamGoals === match.awayTeamGoals) draw += 1;
      return 0;
    });
    const totalPoints = vic * 3 + draw;
    const totalGames = vic + draw + loss;
    return [totalGames, totalPoints, vic, draw, loss];
  }

  public async totalGoals(id: number, isHome: string): Promise<number[]> {
    const matches = await this.findMatchsTeam(id, isHome);
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.map((match) => {
      if (isHome === 'away') {
        goalsFavor += match.awayTeamGoals;
        goalsOwn += match.homeTeamGoals;
        return goalsFavor;
      }
      goalsFavor += match.homeTeamGoals;
      goalsOwn += match.awayTeamGoals;
      return goalsFavor;
    });
    return [goalsFavor, goalsOwn];
  }

  public async getAllData(isHome: string) {
    const allMatchesNotInProgress = await this.teamsModel.findAll();
    return Promise.all(allMatchesNotInProgress.map(async (team) => {
      const name = team.teamName;
      const [totalGames, totalPoints, totalVictories, totalDraws,
        totalLosses] = await this.totalPointsGamesAndVDL(team.id, isHome);
      const [goalsFavor, goalsOwn] = await this.totalGoals(team.id, isHome);
      return {
        name,
        totalGames,
        totalPoints,
        totalVictories,
        totalDraws,
        totalLosses,
        goalsFavor,
        goalsOwn,
      };
    }));
  }

  public async leaderBoard(isHome: string) {
    const allData = await this.getAllData(isHome);
    const result = allData.map((team) => ({
      name: team.name,
      totalPoints: team.totalPoints,
      totalGames: team.totalGames,
      totalVictories: team.totalVictories,
      totalDraws: team.totalDraws,
      totalLosses: team.totalLosses,
      goalsFavor: team.goalsFavor,
      goalsOwn: team.goalsOwn,
      goalsBalance: team.goalsFavor - team.goalsOwn,
      efficiency: ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2),
    }));
    const sorted = sortedResult(result as unknown as ILeaderBoard[]);
    return { status: 'SUCCESSFUL', data: sorted };
  }
}
