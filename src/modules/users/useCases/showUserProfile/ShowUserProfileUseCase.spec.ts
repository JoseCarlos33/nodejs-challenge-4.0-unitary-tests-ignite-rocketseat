import { ShowUserProfileError } from "./ShowUserProfileError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let userId: string;

describe("Show User Profile", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);

    const user = await createUserUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });

    userId = user.id;
  });

  it("should be able to show a user profile", async () => {
    const profile = await showUserProfileUseCase.execute(userId);

    expect(profile).toMatchObject({
      id: userId,
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
    })
  });

  it("should not be able to show a profile of non-existent user", async () => {
    const incorrectId = '112233445566';
    
    await expect(
      showUserProfileUseCase.execute(incorrectId)
    ).rejects.toEqual(new ShowUserProfileError());
  });
});