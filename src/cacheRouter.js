const express = require('express');
const CacheController = require('./cacheController');

/**
 * @fn CacheRouter
 * @desc Router of the cache service
 * @param db
 * @constructor
 */
function CacheRouter(db) {
    this.cacheController = new CacheController(db);
    this.router = express.Router();
    this.router.post('/query', this.cacheController.postQuery);
}

module.exports = CacheRouter;
