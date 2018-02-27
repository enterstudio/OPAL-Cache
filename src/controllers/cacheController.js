function CacheController() {
    this.postQuery = CacheController.prototype.postQuery;
    this.postResult = CacheController.prototype.postResult;
}

CacheController.prototype.postQuery = function(req, res) {
    res.send("Hello World");
};

CacheController.prototype.postResult = function(req, res) {
    res.send("Hello World");
};

module.exports = CacheController;
