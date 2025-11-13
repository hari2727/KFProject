import * as superagent from 'superagent'
import * as http from 'http';
import { Injectable } from '@nestjs/common';
import { Agent } from 'https';
import { HttpsServiceOptions } from './https-service.options';
import * as JSON5 from 'json5';

@Injectable()
export class HttpsService {

    async get(url: string, headers: any, options: HttpsServiceOptions = {}) {
        return new Promise((resolve, reject) =>
            this.setUpAgent(superagent.get(url), headers)
                .then(resp => {
                    const parsed = this.parseResponse(resp);
                    resolve(
                        options.isReturnFullResponse
                            ? {...parsed, status: resp.status}
                            : (parsed?.data || parsed)
                    );
                })
                .catch(reject)
        );
    }

    async post(url: string, headers: any, data: any, options: HttpsServiceOptions = {}) {
        return new Promise((resolve, reject) =>
            this.setUpAgent(superagent.post(url).send(data), headers)
                .then(resp => {
                    const parsed = this.parseResponse(resp);
                    resolve(
                        options.isReturnFullResponse
                            ? parsed
                            : (parsed?.data || parsed)
                    );
                })
                .catch(reject)
        );
    }

    async put(url: string, headers: any, data, options: HttpsServiceOptions = {}) {
        return new Promise((resolve, reject) =>
            this.setUpAgent(superagent.put(url).send(data), headers)
                .then(resp => {
                    const parsed = this.parseResponse(resp);
                    resolve(
                        options.isReturnFullResponse
                            ? parsed
                            : (parsed?.data || parsed)
                    );
                })
                .catch(reject)
        );
    }

    async delete(url: string, headers: any) {
        return new Promise((resolve, reject) =>
            this.setUpAgent(superagent.delete(url), headers)
                .then(resp => {
                    resolve(this.parseResponse(resp));
                })
                .catch(reject)
        );
    }

    protected parseResponse(resp: superagent.Response): any {
        return resp['text'] ? JSON5.parse(resp['text']) : {};
    }

    protected setUpAgent(req: superagent.Request, headers: http.IncomingHttpHeaders) {
        req.set(headers);
        req.agent(new Agent({ rejectUnauthorized: false }));
        return req;
    }
}
