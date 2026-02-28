const swaggerJSDoc = require("swagger-jsdoc");

module.exports = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ChatApp API",
            version: "1.0.0",
            description: "Production-ready Chat APIs (REST + WebSocket)",
        },
        servers: [
            { url: "https://chat.edugaondev.com" },
            { url: "http://localhost:8080" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Raman" },
                        email: { type: "string", example: "raman@test.com" },
                        is_online: { type: "integer", example: 1 },
                    },
                },
                Message: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 12 },
                        conversation_id: { type: "integer", example: 1 },
                        sender_id: { type: "integer", example: 1 },
                        message: { type: "string", example: "Hello Ajay" },
                        delivered: { type: "integer", example: 1 },
                        seen: { type: "integer", example: 0 },
                        created_at: {
                            type: "string",
                            example: "2026-02-27T10:30:00Z",
                        },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/modules/**/*.routes.js"],
});