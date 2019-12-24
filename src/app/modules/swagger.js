module.exports = {
    openapi: '3.0.1',
    info: {
        version: '1.3.0',
        title: 'Users',
        description: 'User management API',
        termsOfService: 'http://api_url/terms/',
        contact: {
            name: 'App-Elent',
            email: 'ericjansen@icloud.com',
            url: 'https://administratie-app.herokuapp.com/',
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [
        {
            url: 'http://localhost:3001/',
            description: 'Local server',
        },
        {
            url: 'https://administratie-app-dev.herokuapp.com',
            description: 'Development server',
        },
        {
            url: 'https://administratie-app-staging.herokuapp.com',
            description: 'Staging server',
        },
        {
            url: 'https://administratie-app.herokuapp.com',
            description: 'Production server',
        },
    ],
    security: [
        {
            ApiKeyAuth: [],
        },
    ],
    tags: [
        {
            name: 'Bunq operations',
        },
        {
            name: 'Event operations',
        },
        {
            name: 'Meterstand operations',
        },
        {
            name: 'User operations',
        },
    ],
    paths: {
        '/users': {
            get: {
                tags: ['User operations'],
                description: 'Get users',
                operationId: 'getUsers',
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        schema: {
                            type: 'integer',
                            default: 1,
                        },
                        required: false,
                    },
                    {
                        name: 'orderBy',
                        in: 'query',
                        schema: {
                            type: 'string',
                            enum: ['asc', 'desc'],
                            default: 'asc',
                        },
                        required: false,
                    },
                ],
                responses: {
                    '200': {
                        description: 'Users were obtained',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Users',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Missing parameters',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                                example: {
                                    message: 'companyId is missing',
                                    internal_code: 'missing_parameters',
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['User operations'],
                description: 'Create user',
                operationId: 'createUser',
                parameters: [],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Users',
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    '200': {
                        description: 'New users were created',
                    },
                    '400': {
                        description: 'Invalid parameters',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                                example: {
                                    message: 'User identificationNumbers 10, 20 already exist',
                                    internal_code: 'invalid_parameters',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            identificationNumber: {
                type: 'integer',
                description: 'User identification number',
                example: 1234,
            },
            username: {
                type: 'string',
                example: 'raparicio',
            },
            userType: {
                type: 'string',
                enum: ['normal', 'admin'],
                default: 'normal',
            },
            companyId: {
                type: 'integer',
                description: 'Company id where the user works',
                example: 15,
            },
            User: {
                type: 'object',
                properties: {
                    identificationNumber: {
                        $ref: '#/components/schemas/identificationNumber',
                    },
                    username: {
                        $ref: '#/components/schemas/username',
                    },
                    userType: {
                        $ref: '#/components/schemas/userType',
                    },
                    companyId: {
                        $ref: '#/components/schemas/companyId',
                    },
                },
            },
            Users: {
                type: 'object',
                properties: {
                    users: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    internal_code: {
                        type: 'string',
                    },
                },
            },
        },
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-api-key',
            },
        },
    },
};
