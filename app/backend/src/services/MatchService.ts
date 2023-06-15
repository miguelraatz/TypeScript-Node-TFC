import IMatch from '../interfaces/matches/IMatch';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { IMatchModel } from '../interfaces/matches/IMatchModel';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel,
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
}
