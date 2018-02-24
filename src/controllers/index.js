let express = require('express');
let os = require('os');
let app = express();

let config = require('../config/opal.cache.config.js');
let OpalCache = require('./opalCache.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

let options = Object.assign({}, config);
let opalCache = new OpalCache(options);

opalCache.start().then(function(cache_router) {
    app.use(cache_router);
    app.listen(config.port, function (error) {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
}, function(error) {
    console.error(error); // eslint-disable-line no-console
});
