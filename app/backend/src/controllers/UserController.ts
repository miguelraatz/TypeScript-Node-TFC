import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(
    private userService: UserService,
  ) { }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const serviceResponse = await this.userService.login(email, password);
    if (serviceResponse.status !== 'SUCCESSFUL') {
      const statusCode = mapStatusHTTP(serviceResponse.status);
      return res.status(statusCode).json(serviceResponse.data);
    }
    return res.status(200).json(serviceResponse.data);
  }

  static getUser(req: Request, res: Response): Promise<Response> {
    const { role } = req.body.verifyToken;
    return res.status(200).json({ role }) as unknown as Promise<Response>;
  }
}
