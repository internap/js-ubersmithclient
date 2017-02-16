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
    use_http_get: true
};

describe('Ubersmith Client', () => {

    this.client = new UbersmithClient(config.url,
        config.user,
        config.password,
        config.timeout,
        config.use_http_get);

    describe('Get clients', () => {

        afterEach(() => {
            nock.cleanAll();
        });

        it('should list a single client', done => {
            _mockHttpGet(config.url, '/api/2.0?method=client.list&client_id=12345', 200, responses.filtered, config.user, config.password);
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
            _mockHttpGet(config.url, '/api/2.0?method=client.list', 200, responses.all, config.user, config.password);
            this.client.client.list()
                .then(res => {
                    expect(res).to.deep.equal(responses.all.data);
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        function _mockHttpGet(baseUrl, endpoint, statusCode, responsePayload, username, password) {
            nock(baseUrl)
                .get(endpoint)
                .basicAuth({
                    user: username,
                    pass: password
                })
                .reply(statusCode, responsePayload);
        }
    });



});