const { Constants } =  require('eae-utils');

const OpalCache = require('../src/opalCache');
// let mongoUrl = 'mongodb://mongodb:27017';
let mongoUrl = 'mongodb://localhost:27017';

function CacheTestServer() {
    let config = {mongoUrl: mongoUrl};
    this.opalCache = new OpalCache(config);
}

CacheTestServer.prototype.setup = function() {
    let _this = this;
    return new Promise(function(resolve) {
        // Setup node env to test during test
        process.env.TEST = 1;
        _this.opalCache.start().then(function() {
            _this.db = _this.opalCache.db;
            _this.db.collection(Constants.EAE_COLLECTION_JOBS).deleteMany({}).then(function() {
                resolve(true);
            });
        });
    });
};

CacheTestServer.prototype.shutdown = function() {
    let _this = this;
    return new Promise(function (resolve) {
        _this.db.close();
        resolve(true);
    });
};

CacheTestServer.prototype.insertJob = function(job) {
  let _this = this;
  return new Promise(function(resolve) {
      _this.db.collection(Constants.EAE_COLLECTION_JOBS).insertOne(job).then(function(document) {
          console.log("Inserted Job");
          resolve(document);
      });
  })
};

module.exports = CacheTestServer;
