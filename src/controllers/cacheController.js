const { Constants } =  require('eae-utils');

function CacheController(db) {
    this.db = db;

    this.postResult = CacheController.prototype.postResult.bind(this);
}

CacheController.prototype.postQuery = function(req, res) {
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

    this.db.collection(Constants.EAE_COLLECTION_JOBS).findOne(filter).then(function(retrievedQuery) {
        if (!retrievedQuery) {
            // Query has never been submitted to the system
            res.send({result: null, waiting: false});
        } else {
            let statuses = [Constants.EAE_JOB_STATUS_CREATED,
                Constants.EAE_JOB_STATUS_QUEUED,
                Constants.EAE_JOB_STATUS_SCHEDULED,
                Constants.EAE_JOB_STATUS_RUNNING
            ];
            if (statuses.includes(retrievedQuery.status[0])) {
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

module.exports = CacheController;
