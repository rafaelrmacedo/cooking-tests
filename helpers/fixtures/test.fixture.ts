import type { test as base } from '@playwright/test';
import { HttpHandler } from '../handler/http-handler';
import { RequestLogger } from '../log/request.logger';
import { TestFixtures } from '../types/test-fixtures.type';

export function createApiTest(baseTest: typeof base) {
  return baseTest.extend<TestFixtures>({
    http: async ({ request }, use) => {
      const logger = new RequestLogger();
      const http = new HttpHandler(request, logger);
      await use(http);
    },
  });
}