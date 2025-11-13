const stopWords = [
    /passw/i,
    /_pass/i,
    /pwd/i,
    /username/i,
    /node_modules/i,
    /_access/i,
    /uname/i,
    /_key/i,
    /_auth/i,
    /:registry/i,
    /git:/i,
    /\.bash/i,
    /\.git/i,
    /\.pm2/i,
    /\.npm/i,
    /\.docker/i,
    /\.aws/i,
    /secret/i,
    /token/i,
    /cert/i,
    /\.pem/i,
    /exists/i,
    /ssh/i,
    /cookie/i,
    /path/i,
    /hostname/i,
    /\/src\//i,
    /\/release\//,
    /_api/i,
    /log_/i,
    /:aws:/i,
    /aws_/i,
    /s3_/i,
    /procedure/i,
    /database/i,
    /\.dbo\./i,
    /query/i,
    /uncaught error/i,
    /exception\sin/i,
    /exception:/i,
    /<anonymous>/i,
    /\.js:/i,
    /\.ts:/i,
    /\.java/i,
    /err_connect/i,
    /cors/i,
    /xss/i,
    /srf/i,
    /<!--/,
    /-->/,
    /ipconfig/,
];

export const _filterStopWords = (value: any): any => {
    const normalizedValue = String(value);
    for (const pattern of stopWords) {
        if (pattern.test(normalizedValue)) {
            return `Message contents is hidden due to non-secured pattern occurrence`;
        }
    }
    return normalizedValue;
}

export const _filterLocaleValue = (value: any): string | null => /^[a-z]{2}(-[a-z]{2})?$/i.test(value ?? '') ? value : null;
