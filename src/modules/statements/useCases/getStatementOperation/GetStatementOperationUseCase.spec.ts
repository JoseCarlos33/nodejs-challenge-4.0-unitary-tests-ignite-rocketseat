import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "@modules/statements/entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let userId: string;
let statementId: string;
let newUser: any;
let newStatement: any;

describe("Statment Operation", () => {
  beforeEach( async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, inMemoryStatementsRepository);

    newUser = await createUserUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });

    newStatement = await createStatementUseCase.execute({
      user_id: newUser.id,
      amount: 10000,
      description: 'Teste',
      type: OperationType.DEPOSIT
    });
    
    userId = newUser.id;
    statementId = newStatement.id;
  });

  it("should be able to show a user statement", async () => {
    const userStatement = await getStatementOperationUseCase.execute({user_id: userId, statement_id: statementId});

    expect(userStatement).toHaveProperty("id");
  });

  it("should not be able to show a user statement with a incorrect user id", async () => {
    const incorrectUserId = '112233445566';
    
    await expect(
      getStatementOperationUseCase.execute({user_id: incorrectUserId, statement_id: statementId})
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to show a user statement with a incorrect statement id", async () => {
    const incorrectStatementId = '112233445566';
    
    await expect(
      getStatementOperationUseCase.execute({user_id: userId, statement_id: incorrectStatementId})
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});