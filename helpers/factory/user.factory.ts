import { faker } from "@faker-js/faker";
import { HttpHandler } from "../handler/http-handler";
import { CreateUserDto } from "../../api/users/dto/create-user.dto";

export class UserFactory {
    static buildValidUser() {
        return {
            name: faker.person.firstName(),
            email: `${Date.now()}_${faker.internet.email({ provider: "test.com" })}`,
            password: "teste123123"
        }
    }

    static async create(http: HttpHandler): Promise<CreateUserDto> {
        const user = this.buildValidUser();
        
        await http.onUsersApi().createNewUser(user);

        return user;
    }
}