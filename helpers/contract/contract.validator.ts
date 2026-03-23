import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import { OpenApiSpec } from "../types/openapi-spec.type";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class ContractValidator {
    private spec: OpenApiSpec;

    constructor(specPath = path.resolve(__dirname, "../../openapi.yaml")) {
        this.spec = yaml.load(fs.readFileSync(specPath, "utf8")) as OpenApiSpec;
    }

    validate(path: string, method: string, statusCode: number, body: unknown): void {
        const schema = this.spec.paths[path]?.[method.toLowerCase()]
            ?.responses?.[String(statusCode)]
            ?.content?.["application/json"]?.schema;

        if (!schema) {
            throw new Error(`No file found for ${method.toUpperCase()} ${path} → ${statusCode}`);
        }

        const valid = ajv.validate(schema, body);
        if (!valid) {
            throw new Error(
                `Contract violation on ${method.toUpperCase()} ${path} (${statusCode}):\n` +
                ajv.errorsText(ajv.errors, { separator: "\n" })
            );
        }
    }
}