import test, { expect } from "@playwright/test";
import { HttpHandler } from "../../helpers/handler/http-handler";
import { RequestLogger } from "../../helpers/log/request.logger";
import { faker } from "@faker-js/faker";
import { CreateUserDto } from "../../api/users/dto/create-user.dto";

const logger = new RequestLogger();

let createdUser: CreateUserDto;

test.beforeEach(async ({ request }) => {
  const http = new HttpHandler(request, logger);
  createdUser = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste123123",
  };
  await http.onUsersApi().createNewUser(createdUser);
});

test.afterEach(async ({ request }) => {
  if (!createdUser?.email) return;
  const http = new HttpHandler(request, logger);
  await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken: (await http.onUsersApi().login(createdUser)).accessToken ?? "",
  });
});

test("Login", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const response = await http.onUsersApi().login(createdUser);
  
  expect(response.response.status()).toBe(201);
});

test("Login - Failure (Invalid password)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const response = await http.onUsersApi().login({
    email: createdUser.email,
    password: "invalid password",
  });

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toContain("Invalid credentials");
});

test("Login - Failure (Inexistent email)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const response = await http.onUsersApi().login({
    email: "emailemail@test.com",
    password: "teste123123",
  });

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toContain("Invalid credentials");
});