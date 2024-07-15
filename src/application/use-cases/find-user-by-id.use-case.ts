import User from '../../domain/entities/user';
import IUserRepositoryPort from '../ports/IUserRepositoryPort';

class FindUserByIdUseCase {
  constructor(private userRepository: IUserRepositoryPort) {}

  async execute(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);

    return user;
  }
}

export default FindUserByIdUseCase;
