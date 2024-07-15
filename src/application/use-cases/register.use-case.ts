import User from '../../domain/entities/user'; 
import IUserRepositoryPort from '../ports/IUserRepositoryPort';

class CreateUserUseCase {
  constructor(private userRepository: IUserRepositoryPort) {}

  async execute(
    email: string,
    password: string,
    name: string,
    username: string,
  ): Promise<User> {
    const user = new User(
      '',
      email,
      password,
      name,
      username,
      {},
    );

    return this.userRepository.create(user);
  }
}

export default CreateUserUseCase;
