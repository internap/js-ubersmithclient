'use strict';

const UbersmithClient = require('../index');
const responses = require('./responses/client.list');

const nock = require('nock');
const chai = require('chai');
const expect = chai.expect;

const config = {
    url: 'http://ub.com',
    user: 'root',
    password: 'test',
    timeout: 10,
};

describe('Ubersmith Client', () => {

    describe('Get clients', () => {

        beforeEach(() => {
            this.client = new UbersmithClient(config.url,
                                              config.user,
                                              config.password,
                                              config.timeout,
                                              true);
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('should list a single client', done => {
            _mockHttpGet(config.url, '/api/2.0/?method=client.list&client_id=12345', 200, responses.filtered);
            this.client.client.list({client_id:12345})
                .then(res => {
                    expect(res).to.deep.equal(responses.filtered.data);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('should list many clients', done => {
            _mockHttpGet(config.url, '/api/2.0/?method=client.list', 200, responses.all);
            this.client.client.list()
                .then(res => {
                    expect(res).to.deep.equal(responses.all.data);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        function _mockHttpGet(baseUrl, endpoint, statusCode, responsePayload) {
            nock(baseUrl)
                .get(endpoint)
                .basicAuth({
                    user: config.user,
                    pass: config.password
                })
                .reply(statusCode, responsePayload);
        }
    });

    describe('POST clients', () => {

        beforeEach(() => {
            this.client = new UbersmithClient(config.url,
                                              config.user,
                                              config.password,
                                              config.timeout,
                                              false);
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('should list a single client', done => {
            _mockHttpPost(config.url,
                          '/api/2.0/',
                          {
                              method: 'client.list',
                              client_id:12345
                          },
                          200,
                          responses.filtered);

            this.client.client.list({client_id:12345})
                .then(res => {
                    expect(res).to.deep.equal(responses.filtered.data);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it('should list many clients', done => {
            _mockHttpPost(config.url,
                '/api/2.0/',
                {
                    method: 'client.list'
                },
                200,
                responses.all);

            this.client.client.list()
                .then(res => {
                    expect(res).to.deep.equal(responses.all.data);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        function _mockHttpPost(baseUrl, endpoint, data, statusCode, responsePayload) {
            nock(baseUrl)
                .post(endpoint, data)
                .basicAuth({
                    user: config.user,
                    pass: config.password
                })
                .reply(statusCode, responsePayload);
        }
    });


});