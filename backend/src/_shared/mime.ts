export const isBinaryMimeType = (mime: string): boolean => {
    return !(
        mime.startsWith('text/') ||
        mime === 'application/json' ||
        mime === 'application/javascript' ||
        mime === 'application/xml' ||
        mime === 'application/x-www-form-urlencoded'
    );
};
