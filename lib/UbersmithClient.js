'use strict';

const request = require('request');
const urlencode = require('urlencode');

class UbersmithClient {
    constructor(uri, user, password, timeout=60, use_http_get=false) {
        this.uri = uri;
        this.user = user;
        this.password = password;
        this.timeout = timeout;
        this.use_http_get = use_http_get;

        return new Proxy({}, {
            get: (target, module) => {
                return this[module] || new Proxy({}, {
                    get: (innerTarget, method) => {
                        return new Proxy(() => {}, {
                            apply: (t, self, args) => {
                                const reqBody = {
                                    method: `${module}.${method}`
                                };
                                if (args.length > 0) {
                                    Object.assign(reqBody, args[0]);
                                }
                                return this._doRequest(reqBody);
                            }
                        });
                    }
                });
            }
        });
    }

    _doRequest(args) {
        const uri = `${this.uri}/api/2.0/`;
        const req = {
            timeout: this.timeout * 1000,
            method: this.use_http_get ? 'GET' : 'POST',
            uri: uri,
            auth: {
                user: this.user,
                pass: this.password
            },
            json: true
        };

        if (this.use_http_get) {
            req.qs = args
        } else {
            req.body = args
        }

        return new Promise((resolve, reject) => {
            request(req, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (body.status) {
                        resolve(body.data);
                    } else {
                        reject(body.error_message);
                    }
                }
            });
        });
    }
}

module.exports = UbersmithClient;
