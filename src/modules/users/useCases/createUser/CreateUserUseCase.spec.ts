import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createCarUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user already existed", async () => {
    await createCarUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });

    await expect(
      createCarUseCase.execute({
        email: 'josecarlosnoronha33@gmail.com',
        name: 'José Carlos de Lima Noronha Filho',
        password: '123123',
      })
    ).rejects.toEqual(new CreateUserError());
  });
});