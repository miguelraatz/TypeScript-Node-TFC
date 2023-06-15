import IUser from '../interfaces/users/IUser';
import SequelizeUsers from '../database/models/SequelizeUsers';
import { IUserModel } from '../interfaces/users/IUserModel';

export default class UserModel implements IUserModel {
  private model = SequelizeUsers;

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      password: user.password,
    };
  }
}
