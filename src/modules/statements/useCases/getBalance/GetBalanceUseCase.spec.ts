import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { OperationType } from "@modules/statements/entities/Statement";

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let userId: string;

describe("User Balance", () => {
  beforeEach( async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, usersRepositoryInMemory);

    const newUser = await createUserUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });

    userId = newUser.id;
  });

  it("should be able to show a user balance", async () => {
    await inMemoryStatementsRepository.create({
      user_id: userId,
      amount: 10000,
      description: 'Teste',
      type: OperationType.DEPOSIT
    });
    
    const userBalance = await getBalanceUseCase.execute({user_id: userId});

    expect(userBalance).toHaveProperty("balance");
  });

  it("should not be able to show a user balance with a incorrect id", async () => {
    const incorrectId = '112233445566';
    
    await expect(
      getBalanceUseCase.execute({user_id: incorrectId})
    ).rejects.toEqual(new GetBalanceError());
  });
});