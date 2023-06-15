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
}
