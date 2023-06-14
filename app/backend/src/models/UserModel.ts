import IUser from '../interfaces/users/IUser';
import SequelizeUsers from '../database/models/SequelizeUsers';

export default class UserModel {
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
