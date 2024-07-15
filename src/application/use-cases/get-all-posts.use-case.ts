import Post from "../../domain/entities/post";
import IPostRepositoryPort from "../../application/ports/IPostRepositoryPort";

class GetAllPostsUseCase {
  constructor(private postRepository: IPostRepositoryPort) {}

  async execute(): Promise<Post[]> {
    return this.postRepository.getAll();
  }
}

export default GetAllPostsUseCase;