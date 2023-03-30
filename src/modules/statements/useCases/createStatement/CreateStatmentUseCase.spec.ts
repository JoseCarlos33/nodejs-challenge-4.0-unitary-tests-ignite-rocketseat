import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType } from "@modules/statements/entities/Statement";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let userId: string;

describe("User Statement", () => {
  beforeEach( async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, inMemoryStatementsRepository);

    const newUser = await createUserUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });

    userId = newUser.id;
  });

  it("should be able to create a user balance", async () => {
    const newStatment = await createStatementUseCase.execute({
      user_id: userId,
      amount: 1000,
      description: 'Teste',
      type: OperationType.DEPOSIT
    });

    expect(newStatment).toHaveProperty("id");
  });

  it("should not be able to create a withdraw with a insuficient founds", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: userId,
        amount: 101003,
        description: 'Teste',
        type: OperationType.WITHDRAW
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });

  it("should not be able to create a incorrect user id", async () => {
    const userIdNonexistent = '1122334455667788991010';

    await expect(
      createStatementUseCase.execute({
        user_id: userIdNonexistent,
        amount: 101003,
        description: 'Teste',
        type: OperationType.WITHDRAW
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });
});