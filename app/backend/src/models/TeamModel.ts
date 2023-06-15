import ITeam from '../interfaces/teams/ITeam';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { ITeamModel } from '../interfaces/teams/ITeamModel';

export default class TeamModel implements ITeamModel {
  private model = SequelizeTeams;

  public async findAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();
    return teams.map(({ dataValues: { id, teamName } }) => ({
      id,
      teamName,
    }));
  }

  public async findById(numberId: number): Promise<ITeam | null> {
    const team = await this.model.findByPk(numberId);
    if (team == null) return null;

    const { id, teamName }: ITeam = team;
    return { id, teamName };
  }
}
