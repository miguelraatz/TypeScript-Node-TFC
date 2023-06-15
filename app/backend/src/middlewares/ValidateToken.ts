import { Request, Response, NextFunction } from 'express';
import { TokenGenerator } from '../interfaces/TokenGenerator';

export default class ValidateToken {
  constructor(
    private tokenGenerator: TokenGenerator,
  ) {}

  public validateToken(req: Request, res: Response, next: NextFunction): Response | void {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }
    try {
      const verifyToken = this.tokenGenerator.verifyToken(authorization);
      req.body = {
        ...req.body,
        verifyToken,
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}
