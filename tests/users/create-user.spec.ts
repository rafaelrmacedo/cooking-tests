import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HttpHandler } from "../../helpers/handler/http-handler";
import { RequestLogger } from "../../helpers/log/request.logger";
const logger = new RequestLogger();

test("Create user - Success", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const payload = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste",
  };

  const response = await http.onUsersApi().createNewUser(payload);

  expect(response.response.status()).toBe(201);
});

test.only("Create user - Failure (Invalid email)", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const payload = {
    name: "teste",
    email: faker.number.int({ min: 1, max: 9999 }).toString(),
    password: "teste",
  };

  const response = await http.onUsersApi().createNewUser(payload);

  expect(response.response.status()).toBe(400);
  expect(response.jsonResponse.message).toContain("email must be an email");
});
