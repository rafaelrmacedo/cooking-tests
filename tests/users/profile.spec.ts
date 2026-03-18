import { CreateUserDto } from '../../api/users/dto/create-user.dto';
import { UserFactory } from '../../helpers/factory/user.factory';
import { test } from '../../helpers/fixtures/test.fixture';
import { expect } from "@playwright/test";

let createdUser: CreateUserDto;
let accessToken: string;

test.beforeEach(async ({ http }) => {
  createdUser = await UserFactory.create(http);

  const loginResponse = await http.onUsersApi().login(createdUser);
  accessToken = loginResponse.accessToken ?? "";
});

test.afterEach(async ({ http }) => {
  await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken,
  });
});

test("Get profile info", async ({ http }) => {
  const response = await http.onUsersApi().profileInfo(accessToken);

  expect(response.response.status()).toBe(200);
  expect(response.jsonResponse.email).toBe(createdUser.email);
});

test("Get profile info - Failure (Malformed token)", async ({ http }) => {
  const response = await http.onUsersApi().profileInfo("invalid-token");

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toBe("Unauthorized");
});