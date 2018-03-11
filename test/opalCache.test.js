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

describe('POST /query', () => {
    test("Cache response is 400 when request does not contain query", async () => {
        expect.assertions(0);

        return request(cacheTestServer.opalCache.app)
            .post('/query')
            .send({})
            .expect(400)
    });
    test("Cache response contains a not null result and waiting set to false when query has been submitted before and is completed", async () => {
        expect.assertions(2);

        let query = {
            startDate: new Date(),
            endDate: new Date(0),
            algorithm: "density",
            aggregationLevel: "A",
            aggregationValue: "B",
            status: [Constants.EAE_JOB_STATUS_COMPLETED, Constants.EAE_JOB_STATUS_RUNNING],
            output: [125],
        };

        await cacheTestServer.insertJob(query);
        return request(cacheTestServer.opalCache.app)
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

    test("Cache response contains null result and waiting set to false when query has not been submitted before", async () => {
        expect.assertions(2);

        let submittedQuery = {
            startDate: new Date(1),
            endDate: new Date(2),
            algorithm: "migration",
            aggregationLevel: "C",
            aggregationValue: "C",
            status: [],
            output: [3213],
        };

        let query = {
            startDate: new Date(),
            endDate: new Date(0),
            algorithm: "density",
            aggregationLevel: "A",
            aggregationValue: "B",
            status: [],
            output: [125],
        };

        await cacheTestServer.insertJob(submittedQuery);
        return request(cacheTestServer.opalCache.app)
            .post('/query')
            .send({job: query})
            .expect(200)
            .expect(function (res) {
                expect(res.body.result).toBeNull();
                expect(res.body.waiting).toBe(false);
            })
    });

    test("Cache response contains null result and waiting set to true when query has been submitted already but the result is not ready yet", async () => {
        expect.assertions(2);

        let query = {
            startDate: new Date(),
            endDate: new Date(0),
            algorithm: "density",
            aggregationLevel: "A",
            aggregationValue: "B",
            status: [Constants.EAE_JOB_STATUS_RUNNING],
            output: [125],
        };

        await cacheTestServer.insertJob(query);
        return request(cacheTestServer.opalCache.app)
            .post('/query')
            .send({job: query})
            .expect(200)
            .expect(function (res) {
                expect(res.body.result).toBeNull();
                expect(res.body.waiting).toBe(true);
            })
    });
});
