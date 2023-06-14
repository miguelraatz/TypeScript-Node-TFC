import { Request, Response, NextFunction } from 'express';

export default class ValidateLogin {
  static validateUser(req: Request, res: Response, next: NextFunction): Response | void {
    const user = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!user.email || !user.password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    if (!emailRegex.test(user.email) || user.password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return next();
  }
}
