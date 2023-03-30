import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);

    await createUserUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      name: 'José Carlos de Lima Noronha Filho',
      password: '123123',
    });
  });

  it("should be able to authenticate a user with correct data", async () => {
    const authentication = await authenticateUserUseCase.execute({
      email: 'josecarlosnoronha33@gmail.com',
      password: '123123',
    })

    expect(authentication).toHaveProperty("token");
  });

  it("should not be able to authenticate with wrong password", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'josecarlosnoronha33@gmail.com',
        password: 'senha-incorreta',
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'email_incorreto@gmail.com',
        password: '123123',
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});