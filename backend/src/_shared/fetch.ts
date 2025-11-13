export const fetchBuffer = async (url: string | URL | globalThis.Request): Promise<Buffer> => {
    return fetch(url)
        .then(_ => _.blob())
        .then(blob => blob.arrayBuffer())
        .then(buffer => Buffer.from(buffer))
        ;
}
