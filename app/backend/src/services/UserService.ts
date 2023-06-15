import { TokenGenerator } from '../interfaces/TokenGenerator';
import { IUserModel } from '../interfaces/users/IUserModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { Encrypter } from '../interfaces/Encrypter';

export default class UserService {
  constructor(
    private userModel: IUserModel,
    private encrypter: Encrypter,
    private tokenGenerator: TokenGenerator,
  ) { }

  public async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = this.tokenGenerator.generate(user);
    return {
      status: 'SUCCESSFUL',
      data: { token },
    };
  }
}
