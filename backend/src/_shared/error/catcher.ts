export class Catcher {

    constructor(
        public readonly name?: string
    ) {
    }

    get errors(): any[] | null {
        return this._errors.length ? [ ...this._errors ] : null;
    }

    protected _errors: any[] = [];

    async tryAsync<T extends any>(cb: () => T): Promise<Awaited<T>> {
        try {
            return await cb();
        } catch (e) {
            this._errors.push(e);
        }
    }

    try<T extends any>(cb: () => T): T {
        try {
            return cb();
        } catch (e) {
            this._errors.push(e);
        }
    }

}
