import test, { expect } from "@playwright/test";
import { HttpHandler } from "../../helpers/handler/http-handler";
import { RequestLogger } from "../../helpers/log/request.logger";
import { faker } from "@faker-js/faker";
const logger = new RequestLogger();

test("Login", async ({ request }) => {
  const http = new HttpHandler(request, logger);

  const newUser = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste",
  };

  await http.onUsersApi().createNewUser(newUser);

  const response = await http.onUsersApi().login(newUser);

  expect(response.response.status()).toBe(201);
});