import { APIRequestContext } from "@playwright/test";
import { RequestLogger } from "../log/request.logger";
import { Users } from "../../api/users/users-api";

export class HttpHandler {
  private readonly requestContext: APIRequestContext;
  private readonly logger: RequestLogger;
  private readonly usersApi: Users;

  // cada endpoint class tem que ser tratado como argumento como um RequestManager e adicionado aqui
  constructor(requestContext: APIRequestContext, logger: RequestLogger) {
    this.requestContext = requestContext;
    this.logger = logger;
    this.usersApi = new Users(requestContext, logger);
  }

  onUsersApi() {
    return this.usersApi;
  }
}
