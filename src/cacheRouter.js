const express = require('express');
const CacheController = require('./controllers/cacheController');

function CacheRouter(db) {
    this.cacheController = new CacheController(db);
    this.router = express.Router();
    this.router.post('/query', this.cacheController.postQuery);
    this.router.post('/result', this.cacheController.postResult);
}

module.exports = CacheRouter;
