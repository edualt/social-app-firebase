import IUserRepositoryPort from "../application/ports/IUserRepositoryPort";
import AuthenticateUserUseCase from "../application/use-cases/authenticate.use-case";
import CreateUserUseCase from "../application/use-cases/register.use-case";
import FindUserByIdUseCase from "../application/use-cases/find-user-by-id.use-case";
import UserRepositoryAdapter from "./repositories/UserRepositoryAdapter";
import CreatePostUseCase from "../application/use-cases/create-post.use-case";
import PostRepositoryAdapter from "./repositories/PostRepositoryAdapter";
import IPostRepositoryPort from "../application/ports/IPostRepositoryPort";
import GetAllPostsUseCase from "../application/use-cases/get-all-posts.use-case";
import UploadPostImageUseCase from "../application/use-cases/upload-post-image.use-case";

const userRepositoryAdapter: IUserRepositoryPort = new UserRepositoryAdapter();
const postRepositoryAdapter: IPostRepositoryPort = new PostRepositoryAdapter();

const authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryAdapter);
const createUserUseCase = new CreateUserUseCase(userRepositoryAdapter);
const findUserByIdUseCase = new FindUserByIdUseCase(userRepositoryAdapter);

const createPostUseCase = new CreatePostUseCase(postRepositoryAdapter);
const getAllPostsUseCase = new GetAllPostsUseCase(postRepositoryAdapter);
const uploadPostImageUseCase = new UploadPostImageUseCase(postRepositoryAdapter);

export { authenticateUserUseCase, findUserByIdUseCase, createUserUseCase, createPostUseCase, getAllPostsUseCase, uploadPostImageUseCase };