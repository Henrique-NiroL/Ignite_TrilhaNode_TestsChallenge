import { compare } from "bcryptjs";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a New User", async () => {
    const user = await createUserUseCase.execute({
      name: "UserTest",
      email: "email@test.com",
      password: "1234",
    });

    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("password");
    expect(user.name).toEqual("UserTest");
    expect(user.email).toEqual("email@test.com");
    expect(compare(user.password, "1234")).toBeTruthy();
  });

  it("Should not be able to create a New User with an already saved email", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        name: "User",
        email: "user@test.com",
        password: "12345",
      });
      await createUserUseCase.execute({
        name: "User1",
        email: "user@test.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
