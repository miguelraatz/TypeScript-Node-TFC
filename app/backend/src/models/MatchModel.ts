import IMatch from '../interfaces/matches/IMatch';
import SequelizeMatches from '../database/models/SequelizeMatches';
import { IMatchModel } from '../interfaces/matches/IMatchModel';
import SequelizeTeams from '../database/models/SequelizeTeams';

const options = [{
  model: SequelizeTeams,
  as: 'homeTeam',
  attributes: ['teamName'],
}, {
  model: SequelizeTeams,
  as: 'awayTeam',
  attributes: ['teamName'],
}];

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatches;

  public async findAll(): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      include: options,
    });
    return matches;
  }

  public async getMatchesInProgress(progress: boolean): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      where: { inProgress: progress },
      include: options,
    });
    return matches;
  }
}
