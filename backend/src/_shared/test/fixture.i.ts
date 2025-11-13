export interface RandomOptions {
    min?: number;
    max?: number;
}

export interface RandomFloatOptions extends RandomOptions {
    precision?: number;
}

export interface RandomStringOptions extends RandomOptions {
    dict?: string;
}

export interface RandomBinaryOptions extends RandomOptions {
    minChar?: number;
    maxChar?: number;
}

export interface RandomURLOptions {
    scheme?: string;
    host?: string;
    port?: number;
    path?: string;
    query?: string;
    fragment?: string;
}

export interface RandomEmailOptions {
    userinfo?: string;
    host?: string;
}
