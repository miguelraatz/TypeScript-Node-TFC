import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class TeamController {
  private teamService = new TeamService();

  public async getAllTeams(_req: Request, res: Response) {
    const serviceResponse = await this.teamService.getAllTeams();
    const statusCode = mapStatusHTTP(serviceResponse.status);
    return res.status(statusCode).json(serviceResponse.data);
  }

  public async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.teamService.getTeamById(Number(id));
    const statusCode = mapStatusHTTP(serviceResponse.status);
    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(statusCode).json(serviceResponse.data);
    }
    return res.status(statusCode).json(serviceResponse.data);
  }
}
