export interface AppBootstrapOptions {
    name?: string;
    port?: number;
    host?: string;
    endPointUri?: string;
    version?: string;
    httpsEnabled?: boolean;
    httpsOptions?: _httpsOptions;
    bodyParser?: _bodyParserOptions;
    swaggerEnabled?: boolean;
    swaggerOptions?: _swaggerOptions;
}

export interface _httpsOptions {
    private_Key?: string;
    public_certificate?: string;
}

export interface _bodyParserOptions {
    limit: string | number;
}

export interface _swaggerOptions {
    version?: string;
    title?: string;
    endPointUri?: string;
    outputFile?: string;
}
