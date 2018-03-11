const { Constants } =  require('eae-utils');

/**
 * @fn CacheController
 * @desc Controller of the cache service
 * @param db
 * @constructor
 */
function CacheController(db) {
    this.db = db;

    this.postQuery = CacheController.prototype.postQuery.bind(this);
    this._waitingForQueryResult = CacheController.prototype._waitingForQueryResult.bind(this);
}

/**
 * @fn postQuery
 * @desc Submit a new query.
 * If the query has been submitted before and the result is already in the database, then
 * it sends back the result.
 * If the query has been submitted before but the result is not yet in the database, then
 * it sends back a message saying the interface to wait and try later.
 * If the query has not been submitted before, then it sends back a message saying that.
 * @param req Incoming message
 * @param res Server Response
 */
CacheController.prototype.postQuery = function(req, res) {
    let _this = this;

    if (!req.body.job) {
        // Request is invalid
        res.send(400);
    }

    let query = req.body.job;

    let filter = {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
        algorithm: query.algorithm,
        aggregationLevel: query.aggregationLevel,
        aggregationValue: query.aggregationValue
    };

    _this.db.collection(Constants.EAE_COLLECTION_JOBS).findOne(filter).then(function(retrievedQuery) {
        if (!retrievedQuery) {
            // Query has never been submitted to the system
            res.send({result: null, waiting: false});
        } else {
            if (_this._waitingForQueryResult(retrievedQuery)) {
                // Query has already been submitted to the system, but the system is still waiting for the result
                res.send({result: null, waiting: true});
            } else {
                // Query has already been already submitted to the system and the system has the result
                res.send({result: retrievedQuery.output, waiting: false});
            }
        }
    }, function (error) {
        console.log(error); // eslint-disable-line no-console
    });
};

CacheController.prototype._waitingForQueryResult = function(query) {
    let waiting_statuses = [
        Constants.EAE_JOB_STATUS_CREATED,
        Constants.EAE_JOB_STATUS_QUEUED,
        Constants.EAE_JOB_STATUS_SCHEDULED,
        Constants.EAE_JOB_STATUS_RUNNING
    ];

    return waiting_statuses.includes(query.status[0]);
};

module.exports = CacheController;
