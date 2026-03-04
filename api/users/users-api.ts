import { APIRequestContext } from "@playwright/test";
import { CreateUserDto } from "./dto/create-user.dto";
import { RequestLogger } from "../../helpers/log/request.logger";
import { IRequestLogger } from "../../helpers/interfaces/IRequest.logger";
import { configDotenv } from "dotenv";
import { LoginDto } from "./dto/login.dto";

configDotenv();

export class Users {
    protected readonly requestContext: APIRequestContext;
    protected readonly logger: RequestLogger;
    protected readonly usersAPIURL = `${process.env.API_URL}/auth`

    constructor(requestContext: APIRequestContext, logger: IRequestLogger) {
        this.requestContext = requestContext;
        this.logger = logger;
    }

    async createNewUser(body: CreateUserDto) {
        const response = await this.requestContext.post(
            `${this.usersAPIURL}/register`,
            { data: body },
        );

        this.logger.logApiRequest(response, body);

        const jsonResponse = await response.json();
        return { response, jsonResponse };
    }

    async login(body: LoginDto) {
        const response = await this.requestContext.post(
            `${this.usersAPIURL}/login`,
            { data: body },
        );

        this.logger.logApiRequest(response, body);

        const jsonResponse = await response.json();
        return { response, jsonResponse };
    }
}
