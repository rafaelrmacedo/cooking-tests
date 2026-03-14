import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HttpHandler } from "../../helpers/handler/http-handler";
import { RequestLogger } from "../../helpers/log/request.logger";
import { CreateUserDto } from "../../api/users/dto/create-user.dto";
const logger = new RequestLogger();

let createdUser: CreateUserDto;
let accessToken: string;

test.beforeEach(async ({ request }) => {
  const http = new HttpHandler(request, logger);
  createdUser = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste123123",
  };

  await http.onUsersApi().createNewUser(createdUser);
  const loginResponse = await http.onUsersApi().login(createdUser);
  accessToken = loginResponse.accessToken ?? "";
});

test.afterEach(async ({ request }) => {
  const http = new HttpHandler(request, logger);
  await http.onUsersApi().deleteUser({
    email: createdUser.email,
    accessToken,
  });
});

test("Get profile info", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const response = await http.onUsersApi().profileInfo(accessToken);

  expect(response.response.status()).toBe(200);
  expect(response.jsonResponse.email).toBe(createdUser.email);
});

test("Get profile info - Failure (Malformed token)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const response = await http.onUsersApi().profileInfo("teste");

  expect(response.response.status()).toBe(401);
  expect(response.jsonResponse.message).toBe("Unauthorized")
});