const express = require('express');
const CacheController = require('./cacheController');

function CacheRouter(db) {
    this.cacheController = new CacheController(db);
    this.router = express.Router();
    this.router.post('/query', this.cacheController.postQuery);
}

module.exports = CacheRouter;
