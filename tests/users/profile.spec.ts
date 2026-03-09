import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HttpHandler } from "../../helpers/handler/http-handler";
import { RequestLogger } from "../../helpers/log/request.logger";
const logger = new RequestLogger();

test("Get profile info", async ({ request }) => {
  const http = new HttpHandler(request, logger);
  const newUser = {
    name: faker.person.firstName(),
    email: faker.number.int({ min: 1, max: 9999 }) + faker.internet.email(),
    password: "teste123123",
  };

  await http.onUsersApi().createNewUser(newUser);

  const { accessToken } = await http.onUsersApi().login(newUser);
  
  const response = await http.onUsersApi().profileInfo(accessToken);

  expect(response.response.status()).toBe(200);
  expect(response.jsonResponse.email).toBe(newUser.email)
});