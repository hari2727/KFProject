import { performance } from 'perf_hooks';

export class MeasurementTask {

    protected result: number;
    protected start: number;
    protected data: string;

    get isRunning(): boolean {
        return this.result === undefined;
    }

    constructor(public name: string) {
        this.start = performance.now();
    }

    stop(data?: any): MeasurementTask {
        if (!this.result) {
            this.result = Math.ceil((performance.now() - this.start) * 1000) / 1000;
        }
        if (data !== undefined) {
            this.data = data;
        }
        return this;
    }

    getStats(): string {
        return `${this.name}: ${this.isRunning ? 'Running' : `${this.result} ms`}${this.data !== undefined ? ` [${JSON.stringify(this.data)}]` : ''}`;
    }
}

export class MeasurementBucket {

    protected tasks = [];

    constructor(protected name: string) {
    }

    start(name: string): MeasurementTask {
        const task = new MeasurementTask(name);
        this.tasks.unshift(task);
        return task;
    }

    stop(name: string, data?: any): MeasurementTask {
        return this.tasks.find(t => t.name === name && t.isRunning)?.stop(data);
    }

    stopAll(): MeasurementTask[] {
        return this.tasks.map(t => t.isRunning() ? t.stop() : t);
    }

    getStats(): string {
        return this.name + ' >> ' + [...this.tasks].reverse().map(t => t.getStats()).join(', ');
    }
}
