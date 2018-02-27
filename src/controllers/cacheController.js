function CacheController() {
    this.postQuery = CacheController.prototype.postQuery;
    this.postResult = CacheController.prototype.postResult;
}

CacheController.prototype.postQuery = function(req, res) {
    res.send("Hello World");

    //TODO: Check if query is present in EAE Jobs collection
    // If it’s there send back result to interface who sends result to user
    // If it’s not there, cache sends message NOT HERE (then interface (axel) handles it)
    // Swagger has job model
    // Cache does not need to store result
    // NO / NO, RUNNING / YES (Payload)

};

CacheController.prototype.postResult = function(req, res) {
    res.send("Hello World");
    //TODO: Forward result to interface
};

module.exports = CacheController;
