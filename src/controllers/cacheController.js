const { Constants } =  require('eae-utils');

function CacheController(db) {
    this.db = db;
    this.postResult = CacheController.prototype.postResult;
    let _this = this;

    //TODO: Move this function out of Cache Contreller after figuring out why 'this' inside the function is not the object
    this.postQuery = function(req, res) {
        if (!req.body.job) {
            // Query is invalid
            res.send(400);
        }

        let query = req.body.job;

        //TODO: Use dates to filter. Figure out why they are in a weird format and don't match the ones in mongo
        let filter = {
            // startDate: query.startDate,
            // endDate: query.endDate,
            algorithm: query.algorithm,
            aggregationLevel: query.aggregationLevel,
            aggregationValue: query.aggregationValue
        };

        _this.db.collection(Constants.EAE_COLLECTION_JOBS).findOne(filter).then(function(retrievedQuery) {
            if (!retrievedQuery) {
                // Query has never been submitted to the system
                res.send({result: null, waiting: false});
            } else {
                let statuses = [Constants.EAE_JOB_STATUS_CREATED,
                    Constants.EAE_JOB_STATUS_QUEUED,
                    Constants.EAE_JOB_STATUS_SCHEDULED,
                    Constants.EAE_JOB_STATUS_RUNNING
                ];
                if (retrievedQuery.status[0] in statuses) {
                    // Query has already been submitted to the system, but the system is still waiting for the result
                    res.send({result: null, waiting: true});
                } else {
                    // Query has already been already submitted to the system and the system has the result
                    res.send({result: retrievedQuery.output, waiting: false})
                }
            }
        });
    };
}

CacheController.prototype.postResult = function(req, res) {
    res.send("Hello World");
    //TODO: Forward result to interface
};

module.exports = CacheController;
