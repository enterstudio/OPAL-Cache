const express = require('express');
const mongodb = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const CacheRouter = require('./cacheRouter');

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

module.exports = OpalCache;
