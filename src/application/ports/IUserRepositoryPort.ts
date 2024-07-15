import User from "../../domain/entities/user";

interface IUserRepositoryPort {
  authenticate(user: User): Promise<User | null>;
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}

export default IUserRepositoryPort;
