import { APIRequestContext } from "@playwright/test";
import { CreateUserDto } from "./dto/create-user.dto";
import { RequestLogger } from "../../helpers/log/request.logger";
import { IRequestLogger } from "../../helpers/interfaces/IRequest.logger";
import { configDotenv } from "dotenv";
import { LoginDto } from "./dto/login.dto";
import { DeleteDto } from "./dto/delete-user.dto";

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
        let accessToken: string | undefined;

        if (jsonResponse.access_token) {
            accessToken = jsonResponse.access_token;
        }

        return { response, jsonResponse, accessToken }
    }

    async profileInfo(accessToken: string | undefined) {
        const response = await this.requestContext.get(
            `${this.usersAPIURL}/profile`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            },
        );

        this.logger.logApiRequest(response, accessToken);

        const jsonResponse = await response.json();
        return { response, jsonResponse };
    }

    async deleteUser(data: DeleteDto) {
        const response = await this.requestContext.delete(
            `${this.usersAPIURL}/${data.email}`,
            {
                headers: {
                    'Authorization': `Bearer ${data.accessToken}`
                }
            }
        );

        this.logger.logApiRequest(response);

        return { response };
    }
}
