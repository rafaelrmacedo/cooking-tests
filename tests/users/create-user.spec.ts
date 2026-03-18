import { test } from '../../helpers/fixtures/test.fixture';
import { CreateUserDto } from "../../api/users/dto/create-user.dto";
import { expect } from '@playwright/test';
import { UserFactory } from '../../helpers/factory/user.factory';

let createdUser: CreateUserDto;

test.beforeEach(async ({ http }) => {
  createdUser = await UserFactory.create(http);
});

test.afterEach(async ({ http }) => {
  if (!createdUser?.email) return;
  const { response } = await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken: (await http.onUsersApi().login(createdUser)).accessToken ?? "",
  });

  if (response.status() !== 204 && response.status() !== 404) {
    console.warn(`Unexpected cleanup status: ${response.status()}`);
  }
});

test("Create user - Success", async ({ http }) => {
  const user = UserFactory.buildValidUser();

  const response = await http.onUsersApi().createNewUser(user);

  expect(response.response.status()).toBe(201);
});

test("Create user - Failure (Invalid email)", async ({ http }) => {
  const payload = { ...createdUser, email: "invalid-email" };
  const response = await http.onUsersApi().createNewUser(payload);

  expect(response.response.status()).toBe(400);
  expect(response.jsonResponse.message).toContain("email must be an email");
});

test("Create user - Failure (Weak password)", async ({ http }) => {
  const payload = { ...createdUser, password: "1231231234" };
  const response = await http.onUsersApi().createNewUser(payload);

  expect(response.response.status()).toBe(400);
  expect(response.jsonResponse.message).toContain("password too weak");
});

test("Create user - Failure (Duplicate email)", async ({ http }) => {
  await http.onUsersApi().createNewUser(createdUser);
  const response = await http.onUsersApi().createNewUser(createdUser);

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toContain("already exists");
});