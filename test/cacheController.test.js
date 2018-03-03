const request = require('supertest');

const { Constants } =  require('eae-utils');
const CacheTestServer = require('./cacheTestServer');

let cacheTestServer = new CacheTestServer();

beforeEach(() => {
    return cacheTestServer.setup();
});

afterAll(function ()  {
    return cacheTestServer.shutdown();
});

test("Cache response contains a not null result and waiting set to false when query has been submitted before and is completed", () => {
    let query = {
        startDate: new Date(),
        endDate: new Date(0),
        algorithm: "density",
        aggregationLevel: "A",
        aggregationValue: "B",
        status: [Constants.EAE_JOB_STATUS_COMPLETED, Constants.EAE_JOB_STATUS_RUNNING],
        output: [125],
    };

    return cacheTestServer.insertJob(query).then(function() {
        request(cacheTestServer.opalCache.app)
            .post('/query')
            .send({job: query})
            .expect(200)
            .expect(function (res) {
                console.log("Body is: ");
                console.log(res.body);
                expect(res.body.result).toEqual(query.output);
                expect(res.body.waiting).toBe(false);
            })
    });
});

test("Cache response contains null result and waiting set to false when query is not been submitted before", () => {
    let query = {
        startDate: new Date(),
        endDate: new Date(0),
        algorithm: "density",
        aggregationLevel: "A",
        aggregationValue: "B",
        status: [],
        output: [125],
    };

    return request(cacheTestServer.opalCache.app)
        .post('/query')
        .send({job: query})
        .expect(200)
        .expect(function(res){
            expect(res.body.result).toBeNull();
            expect(res.body.waiting).toBe(false);
        })
});

test("Cache response contains null result and waiting set to true when query has been submitted already but the result is not ready yet", async () => {
    let query = {
        startDate: new Date(),
        endDate: new Date(0),
        algorithm: "density",
        aggregationLevel: "A",
        aggregationValue: "B",
        status: [Constants.EAE_JOB_STATUS_RUNNING],
        output: [125],
    };

    return cacheTestServer.insertJob(query).then(function() {
        request(cacheTestServer.opalCache.app)
            .post('/query')
            .send({job: query})
            .expect(200)
            .expect(function (res) {
                expect(res.body.result).toBeNull();
                expect(res.body.waiting).toBe(true);
            })
    });
});
