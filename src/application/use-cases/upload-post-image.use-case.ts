import IPostRepositoryPort from "../ports/IPostRepositoryPort";

class UploadPostImageUseCase {
  constructor(private postRepository: IPostRepositoryPort) {}

  async execute(imageUri: string): Promise<string> {
    return await this.postRepository.uploadImage(imageUri);
  }
}

export default UploadPostImageUseCase;