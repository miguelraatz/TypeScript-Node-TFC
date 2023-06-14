import { Identifiable } from '..';

export default interface IUsers extends Identifiable {
  username: string;
  role: string;
  email: string;
  password: string;
}
