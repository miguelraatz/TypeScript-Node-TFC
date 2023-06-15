import IMatch from '../interfaces/matches/IMatch';
import SequelizeMatches from '../database/models/SequelizeMatches';
import { IMatchModel } from '../interfaces/matches/IMatchModel';
import SequelizeTeams from '../database/models/SequelizeTeams';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatches;

  public async findAll(): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      include: [{
        model: SequelizeTeams,
        as: 'homeTeam',
        attributes: ['teamName'],
      }, {
        model: SequelizeTeams,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
    });
    return matches;
  }

  public async findById(id: number): Promise<IMatch | null> {
    const match = await this.model.findByPk(id);
    if (match === null) return null;
    return match;
  }
}
