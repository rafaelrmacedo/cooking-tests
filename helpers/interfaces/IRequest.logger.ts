import { APIResponse } from "@playwright/test";

export interface IRequestLogger {
    logApiRequest(response: APIResponse, payload: any): Promise<void>;
}