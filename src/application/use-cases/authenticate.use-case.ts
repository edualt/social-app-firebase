import User from '../../domain/entities/user';
import IUserRepositoryPort from '../ports/IUserRepositoryPort';

class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepositoryPort) {}

  async execute(email: string, password: string): Promise<User | null> {
    const user = new User('', email, password, '', '');
    return this.userRepository.authenticate(user);
  }
}

export default AuthenticateUserUseCase;
