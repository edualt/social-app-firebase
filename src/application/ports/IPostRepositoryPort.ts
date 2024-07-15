import Post from "../../domain/entities/post";

interface IPostRepositoryPort {
  create(post: Post): Promise<Post>;
  getAll(): Promise<Post[]>;
  uploadImage(imageUril: string): Promise<string>;
}

export default IPostRepositoryPort;