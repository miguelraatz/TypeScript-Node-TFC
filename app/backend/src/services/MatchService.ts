import IMatch from '../interfaces/matches/IMatch';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IMatchModel } from '../interfaces/matches/IMatchModel';
import { NewEntity } from '../interfaces';
import { ITeamModel } from '../interfaces/teams/ITeamModel';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel,
    private teamModel: ITeamModel,
  ) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async getMatchesInProgress(progress: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.getMatchesInProgress(progress);
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<{ message: string }>> {
    await this.matchModel.finishMatch(id);
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number)
    : Promise<void> {
    await this.matchModel.updateMatch(id, homeTeamGoals, awayTeamGoals);
  }

  public async createMatch(match: IMatch): Promise<ServiceResponse<NewEntity<IMatch>>> {
    if (match.homeTeamId === match.awayTeamId) {
      return { status: 'UNPROCESSABLE_ENTITY',
        data: { message: 'It is not possible to create a match with two equal teams' } };
    }
    const findHomeTeam = await this.teamModel.findById(Number(match.homeTeamId));
    const findAwayTeam = await this.teamModel.findById(Number(match.awayTeamId));

    if (!findHomeTeam || !findAwayTeam) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }
    const createdMatch = await this.matchModel.createMatch(match);
    return { status: 'SUCCESSFUL', data: createdMatch };
  }
}
