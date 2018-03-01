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

test("Cache response contains a not null result and waiting set to false when query has been submitted before and is completed", async () => {
    let query = {
        startDate: new Date(),
        endDate: new Date(0),
        algorithm: "density",
        aggregationLevel: "A",
        aggregationValue: "B",
        status: [Constants.EAE_JOB_STATUS_COMPLETED],
        output: [125],
    };

    await cacheTestServer.insertJob(query);

    return request(cacheTestServer.opalCache.app)
        .post('/query')
        .send({job: query})
        .expect(200)
        .expect(function(res){
            console.log("Body is: ");
            console.log(res.body);
            expect(res.body.result).toEqual(query.output);
            expect(res.body.waiting).toBe(false);
        })

});

test("Cache response contains null result and waiting set to false when query is not been submitted before", async () => {
    let query = {
        startDate: new Date(),
        endDate: new Date(0),
        algorithm: "density",
        aggregationLevel: "A",
        aggregationValue: "B",
        status: [Constants.EAE_JOB_STATUS_COMPLETED],
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


