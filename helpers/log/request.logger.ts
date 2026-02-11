import { APIResponse } from "@playwright/test";
import { IRequestLogger } from "../interfaces/IRequest.logger";

export class RequestLogger implements IRequestLogger {
    async logApiRequest(response: APIResponse, payload?: any): Promise<void> {
        console.log(`Endpoint: ${response.url()}`);

        if(!payload) {
            console.log(`No payload needed for this endpoint`);
            return;
        }

        console.log(`Payload: ${JSON.stringify(payload)}`);
        console.log(`Response status: ${response.status()}`);
        console.log(`Response body: \n ${await response.text()}`);
    }
}