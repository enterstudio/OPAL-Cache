const express = require('express');
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const { StatusHelper, Constants } = require('eae-utils');
const { Constants_Opal } = require('opal-utils');

const CacheRouter = require('./cacheRouter');
const StatusController = require('./statusController');
const config = require('../config/opal.cache.config');
const package_json = require('../package.json');

/**
 * @fn OpalCache
 * @desc OpalCache class
 * @param config
 * @constructor
 */
function OpalCache(config) {
    this.app = express();
    this.config = config;

    this.start = OpalCache.prototype.start.bind(this);
    this.connectToDatabase = OpalCache.prototype.connectToDatabase.bind(this);
    this._setupStatusController = OpalCache.prototype._setupStatusController.bind(this);
}

/**
 * @fn start
 * @desc Start the OpalCache
 */
OpalCache.prototype.start = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        _this.connectToDatabase().then(function(db) {
            _this.db = db;
            _this._setupStatusController();
            let cacheRouter = new CacheRouter(db);
            _this.app.use(bodyParser.json());
            _this.app.use(cacheRouter.router);
            resolve(_this.app);
        }, function(error) {
            reject(error);
        });
    });
};

/**
 * @fn connectToDatabase
 * @desc Connect to the mongodb database
 */
OpalCache.prototype.connectToDatabase = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        mongodb.connect(_this.config.mongoUrl, function(error, db) {
            if (error) {
                reject('Could not connect to database');
            } else {
                resolve(db);
            }
        });
    });
};

/**
 * @fn _setupStatusController
 * @desc Initialize status service routes and controller
 * @private
 */
OpalCache.prototype._setupStatusController = function () {
    let _this = this;

    let statusOpts = {
        version: package_json.version
    };
    _this.status_helper = new StatusHelper(Constants_Opal.OPAL_SERVICE_TYPE_CACHE, _this.config.port, null, statusOpts);
    _this.status_helper.setCollection(_this.db.collection(Constants.EAE_COLLECTION_STATUS));
    _this.status_helper.setStatus(Constants.EAE_SERVICE_STATUS_BUSY);

    _this.statusController = new StatusController(_this.status_helper);
    _this.app.get('/status', _this.statusController.getStatus); // GET status
    _this.app.get('/specs', _this.statusController.getFullStatus); // GET Full status
};

module.exports = OpalCache;
