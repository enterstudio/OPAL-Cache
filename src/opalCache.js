const express = require('express');
const CacheController = require('./controllers/cacheController')

function OpalCache(config) {
    this.app = express();

    this.app.post('/query', CacheController.postQuery);
    this.app.post('/result', CacheController.postResult);
}


