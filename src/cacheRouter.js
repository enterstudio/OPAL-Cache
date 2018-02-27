const express = require('express');
const CacheController = require('./controllers/cacheController');

function CacheRouter() {
    this.cacheController = new CacheController();
    this.router = express.Router();
    this.router.post('/query', this.cacheController.postQuery);
    this.router.post('/result', this.cacheController.postResult);
}

module.exports = CacheRouter;
