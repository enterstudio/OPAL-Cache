const express = require('express');
const CacheRouter = require('./cacheRouter');

function OpalCache(config) {
    let _this = this;
    this.app = express();
    let cacheRouter = new CacheRouter();

    this.app.use(cacheRouter.router);

    this.start = function() {
        return new Promise(function(resolve, reject) {
           resolve(_this.app);
        });
    }
}


module.exports = OpalCache;
