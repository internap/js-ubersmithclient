'use strict';

const UbersmithClient = require('../index');
const responses = require('./responses/client.list');
const UbersmithError = require('../lib/errors/UbersmithError');

const nock = require('nock');
const chai = require('chai');
const expect = chai.expect;

const config = {
    url: 'http://ub.com',
    user: 'root',
    password: 'test',
    timeout: 10
};

describe('Ubersmith Client', () => {

    describe('In GET mode', () => {

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
            this.client.client.list({client_id: 12345})
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

        it('should raise a UbersmithTransportError when response has HTTP code below 200', done => {
            _mockHttpGet(config.url, '/api/2.0/?method=uber.method_name', 199,
                'EXACT ERROR TEXT', {'Content-Type': 'text/html'});

            this.client.uber.method_name()
                .then(res => {
                    done('should not get here');
                })
                .catch(err => {
                    expect(err).to.deep.equal(new UbersmithError.ubersmithTransportError('EXACT ERROR TEXT', 199));
                    done();
                })
        });

        it('should raise a UbersmithTransportError when response has HTTP code 450', done => {
            _mockHttpGet(config.url, '/api/2.0/?method=uber.method_name', 450,
                'EXACT ERROR TEXT', {'Content-Type': 'text/html'});

            this.client.uber.method_name()
                .then(res => {
                    done('should not get here');
                })
                .catch(err => {
                    expect(err).to.deep.equal(new UbersmithError.ubersmithTransportError('EXACT ERROR TEXT', 450));
                    done();
                })
        });

        it('should raise a UbersmithApplicationError when API call was not a success', done => {
            _mockHttpGet(config.url, '/api/2.0/?method=client.list', 200, responses.errored);

            this.client.client.list()
                .then(res => {
                    done('should not get here');
                })
                .catch(err => {
                    expect(err).to.deep.equal(new UbersmithError.ubersmithApplicationError(responses.errored));
                    done();
                });

        });

        function _mockHttpGet(baseUrl, endpoint, statusCode, responsePayload, headers = {}) {
            nock(baseUrl)
                .get(endpoint)
                .basicAuth({
                    user: config.user,
                    pass: config.password
                })
                .reply(statusCode, responsePayload, headers);
        }
    });

    describe('In POST mode', () => {

        beforeEach(() => {
            this.client = new UbersmithClient(
                config.url,
                config.user,
                config.password,
                config.timeout,
                false
            );
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('should list a single client', done => {
            _mockHttpPost(
                config.url,
                '/api/2.0/',
                'method=client.list&client_id=12345',
                200,
                responses.filtered
            );

            this.client.client.list({client_id: 12345})
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

        it('should raise a UbersmithTransportError when response has HTTP code below 200', done => {
            _mockHttpPost(config.url,
                '/api/2.0/',
                {
                    method: 'uber.method_name'
                },
                199,
                'EXACT ERROR TEXT', {'Content-Type': 'text/html'});

            this.client.uber.method_name()
                .then(res => {
                    done('should not get here');
                })
                .catch(err => {
                    expect(err).to.deep.equal(new UbersmithError.ubersmithTransportError('EXACT ERROR TEXT', 199));
                    done();
                })
        });

        it('should raise a UbersmithTransportError when response has HTTP code 450', done => {
            _mockHttpPost(config.url,
                '/api/2.0/',
                {
                    method: 'uber.method_name'
                },
                450,
                'EXACT ERROR TEXT', {'Content-Type': 'text/html'});

            this.client.uber.method_name()
                .then(res => {
                    done('should not get here');
                })
                .catch(err => {
                    expect(err).to.deep.equal(new UbersmithError.ubersmithTransportError('EXACT ERROR TEXT', 450));
                    done();
                })
        });

        it('should raise a UbersmithApplicationError when API call was not a success', done => {
            _mockHttpPost(config.url,
                '/api/2.0/',
                {
                    method: 'client.list'
                },
                200, responses.errored);

            this.client.client.list()
                .then(res => {
                    done('should not get here');
                })
                .catch(err => {
                    expect(err).to.deep.equal(new UbersmithError.ubersmithApplicationError(responses.errored));
                    done();
                });

        });

        function _mockHttpPost(baseUrl, endpoint, data, statusCode, responsePayload, headers = {}) {
            nock(baseUrl)
                .post(endpoint, data)
                .basicAuth({
                    user: config.user,
                    pass: config.password
                })
                .reply(statusCode, responsePayload, headers);
        }
    });


});
