import * as jwt from 'jsonwebtoken';
import IUser from '../interfaces/users/IUser';
import { TokenGenerator } from '../interfaces/TokenGenerator';

export default class TokenGeneratorJwt implements TokenGenerator {
  private jwt = jwt;
  private secret = process.env.JWT_SECRET || 'SECRET';
  private jwtConfig: jwt.SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id }, this.secret, this.jwtConfig);
    return token;
  }
}
