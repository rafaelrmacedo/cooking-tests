import { test } from '../../helpers/fixtures/test.fixture';
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { CreateUserDto } from "../../api/users/dto/create-user.dto";

let createdUser: CreateUserDto;

test.beforeEach(async ({ http }) => {
  createdUser = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste123123",
  };
  await http.onUsersApi().createNewUser(createdUser);
});

test.afterEach(async ({ http }) => {
  if (!createdUser?.email) return;
  await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken: (await http.onUsersApi().login(createdUser)).accessToken ?? "",
  });
});

test("Login", async ({ http }) => {
  const response = await http.onUsersApi().login(createdUser);
  
  expect(response.response.status()).toBe(201);
});

test("Login - Failure (Invalid password)", async ({ http }) => {
  const response = await http.onUsersApi().login({
    email: createdUser.email,
    password: "invalid password",
  });

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toContain("Invalid credentials");
});

test("Login - Failure (Inexistent email)", async ({ http }) => {
  const response = await http.onUsersApi().login({
    email: "emailemail@test.com",
    password: "teste123123",
  });

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toContain("Invalid credentials");
});