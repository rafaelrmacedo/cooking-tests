export type OpenApiSpec = {
  paths: Record<string, Record<string, { responses: Record<string, { content?: Record<string, { schema: object }> }> }> >;
};