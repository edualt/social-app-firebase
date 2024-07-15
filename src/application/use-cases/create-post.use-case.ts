import { FieldValue } from "firebase/firestore";
import Post from "../../domain/entities/post";
import IPostRepositoryPort from "../ports/IPostRepositoryPort";

class CreatePostUseCase {
  constructor(private postRepository: IPostRepositoryPort) {}

  async execute(
    text: string,
    authorID: string,
    media: string,
    mediaType: string,
    createdAt: FieldValue,
  ): Promise<Post> {
    const post = new Post(
      '',
      text,
      authorID,
      media,
      mediaType,
      createdAt,
    );

    return this.postRepository.create(post);
  }
}

export default CreatePostUseCase;