const request = require('supertest');
const OpalCache = require('../src/opalCache');

let opalCache = new OpalCache();

describe('loading express', function () {
    it('Posting a query succeeds', function(done) {
        request(opalCache.app)
            .post('/query')
            .expect(200, done);
    });
    it('Posting a result succeeds', function(done) {
        request(opalCache.app)
            .post('/result')
            .expect(200, done);
    });
    it('404 everything else', function(done) {
        request(opalCache.app)
            .get('/foo/bar')
            .expect(404, done);
    });
});
