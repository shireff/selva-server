import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const configureSwagger = (app, PORT) => {
  // Swagger configuration
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Selva Nail Shop API",
        version: "1.0.0",
        description: "API for Selva Hard Gel Nail Shop management system",
        contact: {
          name: "Selva Team",
          email: "shireffn369@gmail.com",
        },
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: "Development server",
        },
        {
          url: "https://selva-server.vercel.app/",
          description: "Production server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ["./src/routes/*.js", "./src/models/*.js"],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // API Documentation
  const swaggerUiOptions = {
    customCssUrl: "https://unpkg.com/swagger-ui-dist/swagger-ui.css",
    customJs: [
      "https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js",
      "https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js",
    ],
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );
};
