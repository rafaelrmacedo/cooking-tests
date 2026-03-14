import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HttpHandler } from "../../helpers/handler/http-handler";
import { RequestLogger } from "../../helpers/log/request.logger";
import { CreateUserDto } from "../../api/users/dto/create-user.dto";

const logger = new RequestLogger();

let createdUser: CreateUserDto;

test.beforeEach(() => {
  createdUser = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste123123",
  };
});

test.afterEach(async ({ request }) => {
  if (!createdUser?.email) return;
  const http = new HttpHandler(request, logger);
  const { response } = await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken: "",
  });

  if (response.status() !== 204 && response.status() !== 404) {
    console.warn(`Unexpected cleanup status: ${response.status()}`);
  }
});

test("Create user - Success", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const response = await http.onUsersApi().createNewUser(createdUser);

  expect(response.response.status()).toBe(201);
});

test("Create user - Failure (Invalid email)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const payload = { ...createdUser, email: faker.number.int({ min: 1, max: 9999 }).toString() };
  const response = await http.onUsersApi().createNewUser(payload);

  expect(response.response.status()).toBe(400);
  expect(response.jsonResponse.message).toContain("email must be an email");
});

test("Create user - Failure (Weak password)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const payload = { ...createdUser, password: "1231231234" };
  const response = await http.onUsersApi().createNewUser(payload);

  expect(response.response.status()).toBe(400);
  expect(response.jsonResponse.message).toContain("password too weak");
});

test("Create user - Failure (Duplicate email)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  await http.onUsersApi().createNewUser(createdUser);
  const response = await http.onUsersApi().createNewUser(createdUser);

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toContain("already exists");
});