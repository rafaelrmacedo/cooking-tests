# Playwright API Testing Framework

## Disclamer
This framework was made around my programming 5 course from university. If you want to actually use it, adapt the tests and the .env to use your backend server.
In addition, this is my first API framework with Playwright. If you have a feedback for the project, feel free to open an issue or a pull request.
Finally, the project is configured to use a self-hosted Github Runner, because my university project only runs on my local machine.

## Overview
This project demonstrates how to use Playwright using its APIRequestContext to perform direct HTTP requests and validate backend behavior.
The goal is to provide a clean, extensible and a scalable structure for API testing, focusing on maintainability, readability, and a CI/CD routine.

## Basic structure
```
├── api/                  # API endpoints
├── helpers/              # Utilities and reusable logic
├── fixtures/             # Custom Playwright fixtures
├── tests/                # API test cases ordened by endpoint/database entities
```

## How to use
### Libs and tools
- Node (18+)
- pnpm

### Installation
Clone the repo and move to its directory:
```
git clone https://github.com/rafaelrmacedo/playwright-api-framework.git
cd playwright-api-framework
```

Install dependencies:
`pnpm install` or `pnpm i`

Install browsers:
`npx playwright install`

### Running tests
`npx playwright test`
