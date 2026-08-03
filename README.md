# Playwright API Testing Framework

[![npm version](https://img.shields.io/badge/npm-v1.0.1-blue.svg)](https://www.npmjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58-green?logo=playwright)](https://playwright.dev/)
[![Package Manager](https://img.shields.io/badge/pnpm-10.3-orange?logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-ISC-brightgreen.svg)](LICENSE)

An extensible, type-safe API Testing Framework and reusable NPM library built on top of Playwright's `APIRequestContext`. 

It offers custom test fixtures, centralized HTTP request handling, automatic request logging, and OpenAPI contract validation out-of-the-box.

---

## Background & Context

This project originated as part of my **Programming 5 university course**. After completing the coursework, I refactored and modularized the architecture into a **standalone TypeScript library** (`@rafael_dev/playwright-api-framework`) to be reused across different API testing projects.<br/>
For example, my Software Development 5 university course has a testing module using this library. Go check it out 
[here](https://github.com/rafaelrmacedo/pix-pro)

> **Disclaimer:** Even if this project is working properly, I strongly recommend to **NOT** use it in a production environment.

---

## Key Features

- **NPM Package Distribution:** Pre-compiled TypeScript library (`dist/`) exported with full type definitions (`.d.ts`).
- **Custom Playwright Fixtures (`createApiTest`):** Injects a pre-configured `http` handler directly into Playwright tests.
- **Robust HttpHandler:** Wraps `APIRequestContext` to simplify request execution, response parsing, and error reporting.
- **Contract Validation:** Built-in `ContractValidator` leveraging **AJV** and **OpenAPI (Swagger)** specs to validate schema compliance.
- **Automated Request Logging:** Formatted logging of URLs, method, status code, payload, headers, and responses for quick debugging.
- **Data Generation & Factories:** Integrated with `@faker-js/faker` for dynamic data generation and factory patterns (`UserFactory`).

---

## Usage Guide

### Option 1: Integrating as a Library Package

You can import core abstractions (`createApiTest`, `HttpHandler`, `ContractValidator`, `RequestLogger`) directly into your own project:

```bash
pnpm add -D @rafael_dev/playwright-api-framework @playwright/test
```

**Example Test in your Project:**
```typescript
import { createApiTest, HttpHandler } from '@rafael_dev/playwright-api-framework';

const test = createApiTest();

test('GET /users - Check Status', async ({ http }) => {
  const response = await http.get('/users');
  expect(response.response.status()).toBe(200);
});
```

---

## Repository Structure

```text
├── api/                  # Endpoint-specific API wrappers & DTO definitions
│   └── users/            # Example user API endpoints & DTOs
├── helpers/              # Framework core helpers & utilities
│   ├── contract/         # AJV & OpenAPI schema contract validator
│   ├── factory/          # Test data factories (Faker.js)
│   ├── fixtures/         # Custom Playwright test fixtures
│   ├── handler/          # Central HttpHandler abstraction
│   └── log/              # Request & response loggers
├── tests/                # Test cases organized by domain entities
├── index.ts              # Library entry point exporting core abstractions
├── openapi.yaml          # OpenAPI specification for contract tests
├── playwright.config.ts  # Playwright configuration
└── package.json          # Package manifest (@rafael_dev/playwright-api-framework)
```