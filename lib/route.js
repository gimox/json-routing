/**
 * Includes
 */
var fs      = require('fs');
var path    = require('path');
var _       = require('underscore');
var load    = require('./load');

/**
 * Bootstrap module
 */
module.exports = function(app, userOptions) {
    // defaults
    var options = {
        routes : './routes'
        , setup  : 'init'
        , vars   : null
    }

    // make sure userOptions is something
    if (_.isUndefined(userOptions)) userOptions = {};

    // combine any specified options with the defaults
    _.extend(options, userOptions);

    // get route files
    var files     = fs.readdirSync(options.routes);
    var jsonFiles = _.filter(files, function(file){ return path.extname(file) == '.json' });

    jsonFiles.forEach(function(file){
        options.routeName = file.split('.')[0];
        options.basePath  = path.join(process.cwd(), options.routes);

        load(app, options);
    });
};