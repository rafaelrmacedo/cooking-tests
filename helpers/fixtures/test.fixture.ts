import { test as base } from '@playwright/test';
import { HttpHandler } from '../handler/http-handler';
import { RequestLogger } from '../log/request.logger';

type TestFixtures = {
  http: HttpHandler;
};

export const test = base.extend<TestFixtures>({
  http: async ({ request }, use) => {
    const logger = new RequestLogger();
    const http = new HttpHandler(request, logger);

    await use(http);
  },
});