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

  public async finishMatch(id: number): Promise<void> {
    await this.model.update(
      { inProgress: false },
      { where: { id }, returning: true },
    );
  }

  public async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number)
    : Promise<void> {
    const newGoals = {
      homeTeamGoals,
      awayTeamGoals,
    };
    await this.model.update(
      newGoals,
      { where: { id, inProgress: true }, returning: true },
    );
  }

  public async createMatch(match: IMatch): Promise<IMatch> {
    const newMatch = {
      homeTeamId: match.homeTeamId,
      homeTeamGoals: match.homeTeamGoals,
      awayTeamId: match.awayTeamId,
      awayTeamGoals: match.awayTeamGoals,
    };

    const createdMatch = await this.model.create({
      ...newMatch,
      inProgress: true,
    });
    return createdMatch;
  }
}
