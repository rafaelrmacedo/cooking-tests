import { test } from '../../helpers/fixtures/test.fixture';
import { expect } from "@playwright/test";
import { CreateUserDto } from "../../api/users/dto/create-user.dto";
import { UserFactory } from '../../helpers/factory/user.factory';
import { ContractValidator } from '../../helpers/contract/contract.validator';

const contract = new ContractValidator();
let createdUser: CreateUserDto;

test.beforeEach(async ({ http }) => {
  createdUser = await UserFactory.create(http);
});

test.afterEach(async ({ http }) => {
  if (!createdUser?.email) return;
  await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken: (await http.onUsersApi().login(createdUser)).accessToken ?? "",
  });
});

test("Login - Success", async ({ http }) => {
  const response = await http.onUsersApi().login(createdUser);
  
  expect(response.response.status()).toBe(201);

  contract.validate("/login", "POST", 201, response.jsonResponse);
});

test("Login - Failure (Invalid password)", async ({ http }) => {
  const response = await http.onUsersApi().login({
    email: createdUser.email,
    password: "invalid password",
  });

  expect(response.response.status()).toBe(401);

  contract.validate("/login", "POST", 401, response.jsonResponse);

  expect(response.jsonResponse.message).toContain("Invalid credentials");
});

test("Login - Failure (Inexistent email)", async ({ http }) => {
  const response = await http.onUsersApi().login({
    email: "emailemail@test.com",
    password: "teste123123",
  });

  expect(response.response.status()).toBe(401);

  contract.validate("/login", "POST", 401, response.jsonResponse);

  expect(response.jsonResponse.message).toContain("Invalid credentials");
});