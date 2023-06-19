import sortedResult from '../utils/sortedLeaderBoard';
import SequelizeMatches from '../database/models/SequelizeMatches';
import SequelizeTeams from '../database/models/SequelizeTeams';
import ILeaderBoard from '../interfaces/leaderboard/ILeaderBoard';

export default class LeaderBoardService {
  constructor(
    private teamsModel = SequelizeTeams,
    private matchModel = SequelizeMatches,
  ) { }

  public async findMatchsTeam(id: number) {
    const matchsHomeTeam = await this.matchModel.findAll({
      where: { inProgress: false, homeTeamId: id },
    });
    return matchsHomeTeam;
  }

  public async totalGames(id: number): Promise<number[]> {
    const matches = await this.findMatchsTeam(id);
    return [matches.length];
  }

  public async totalPoints(id: number): Promise<number[]> {
    const matches = await this.findMatchsTeam(id);
    let acc = 0;
    matches.map((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) acc += 3;
      if (match.homeTeamGoals > match.awayTeamGoals) acc += 0;
      if (match.homeTeamGoals === match.awayTeamGoals) acc += 1;
      return acc;
    });
    return [acc];
  }

  public async totalVDL(id: number): Promise<number[]> {
    const matches = await this.findMatchsTeam(id);
    let vic = 0;
    let draw = 0;
    let loss = 0;
    matches.map((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) vic += 1;
      if (match.homeTeamGoals < match.awayTeamGoals) loss += 1;
      if (match.homeTeamGoals === match.awayTeamGoals) draw += 1;
      return vic;
    });
    return [vic, draw, loss];
  }

  public async totalGoals(id: number): Promise<number[]> {
    const matches = await this.findMatchsTeam(id);
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.map((match) => {
      goalsFavor += match.homeTeamGoals;
      goalsOwn += match.awayTeamGoals;
      return goalsFavor;
    });
    return [goalsFavor, goalsOwn];
  }

  public async getAllData() {
    const allMatchesNotInProgress = await this.teamsModel.findAll();
    return Promise.all(allMatchesNotInProgress.map(async (team) => {
      const name = team.teamName;
      const [totalGames] = await this.totalGames(team.id);
      const [totalPoints] = await this.totalPoints(team.id);
      const [totalVictories, totalDraws, totalLosses] = await this.totalVDL(team.id);
      const [goalsFavor, goalsOwn] = await this.totalGoals(team.id);
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

  public async leaderBoardHome() {
    const allData = await this.getAllData();
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
    return sorted;
  }
}
