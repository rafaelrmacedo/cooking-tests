import { APIRequestContext } from "@playwright/test";
import { RequestLogger } from "../log/request.logger";

export class HttpHandler {
  private readonly requestContext: APIRequestContext;
  private readonly logger: RequestLogger;
  private readonly instances = new Map<any, any>();

  constructor(requestContext: APIRequestContext, logger?: RequestLogger) {
    this.requestContext = requestContext;
    this.logger = logger ?? new RequestLogger();
  }

  get context(): APIRequestContext {
    return this.requestContext;
  }

  get getLogger(): RequestLogger {
    return this.logger;
  }

  api<T>(ApiClass: new (context: APIRequestContext, logger: RequestLogger) => T): T {
    if (!this.instances.has(ApiClass)) {
      this.instances.set(ApiClass, new ApiClass(this.requestContext, this.logger));
    }
    return this.instances.get(ApiClass);
  }
}
