import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Basic Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'LMS API Documentation',
        version: '1.0.0',
        description: 'API documentation for the LMS project',
    },
    servers: [
        {
            url: 'http://localhost:8090/api/v1/lmsb',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/main_routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
