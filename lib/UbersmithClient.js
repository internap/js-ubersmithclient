'use strict';

const request = require('request');
const urlencode = require('urlencode');

class UbersmithClient {
    constructor(url, user, password, timeout=60, use_http_get=false) {
        this.url = url;
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
                                const qs = args.length > 0 ? '&' + Object.keys(args[0])
                                    .map(key => {
                                        return `${urlencode(key)}=${urlencode(args[0][key])}`
                                    })
                                    .join('&') : '';
                                const uri = `${this.url}/api/2.0?method=${module}.${method}${this.use_http_get ? qs : ''}`;
                                const req = {
                                    timeout: this.timeout * 1000,
                                    method: this.use_http_get ? 'GET' : 'POST',
                                    uri: uri,
                                    auth: {
                                        user: this.user,
                                        pass: this.password
                                    },
                                    headers: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                    },
                                };
                                if (!this.use_http_get) {
                                    req.body = args[0];
                                }
                                return new Promise((resolve, reject) => {
                                    request(req, (error, response, body) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            resolve(JSON.parse(body)['data']);
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = UbersmithClient;
