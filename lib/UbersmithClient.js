'use strict';

const request = require('request');
const urlencode = require('urlencode');
const UbersmithError = require('./errors/UbersmithError');


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
            }
        };

        if (this.use_http_get) {
            req.qs = args
        } else {
            req.form = args
        }

        return new Promise((resolve, reject) => {
            request(req, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode == 200) { // Valid Ubersmith response
                        // Responses are returned in JSON format (with the exception of specialized methods which return raw PDF, Image, XML or HTML data), and include the standard elements:
                        //     status - API call success true/false
                        //     error_code - error code for failed API calls
                        //     error_message - error message for failed API calls
                        //     data - results of API call
                        //
                        // Example Output
                        // {
                        //     "status":true,
                        //     "error_code":null,
                        //     "error_message":"",
                        //     "data": "<api call output here>"
                        // }
                        const jsonBody = JSON.parse(body);
                        if (jsonBody.status) {
                            resolve(jsonBody.data);
                        } else {
                            reject(new UbersmithError.ubersmithApplicationError(jsonBody));
                        }
                    } else {
                        reject(new UbersmithError.ubersmithTransportError(response.body, response.statusCode));
                    }
                }
            });
        });
    }
}

module.exports = UbersmithClient;
