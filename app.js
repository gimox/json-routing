var express   = require('express')
    , app     = express()
    , logger  = require('morgan')
    , port    = process.env.PORT || 3000
    , routing = require('./lib/route');

app.use(logger('dev'));
/**
 * global options for routing
 *
 * @type {{routesPath: string, controllersPath: string, action: string, vars: null}}
 */
var routeOptions = {
    routesPath       : "./demo/routes"
    , controllersPath: "./demo/controllers"
    , policyPath     : './demo/policy'
    , cors           : false
};

/**
 * init json-routing
 */
routing(app, routeOptions);

/**
 * standard express 4 routing
 */

var router = express.Router();
router.get('/express/:name', function (req, res) {
    res.send(' This is a express standard routing ');
});
app.use('/', router);

/**
 * server start
 *
 * @type {http.Server}
 */
var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});