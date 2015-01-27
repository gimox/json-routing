var fs     = require('fs')
    , path = require('path')
    , _    = require('underscore')
    , load = require('./load');

/**
 * main function
 *
 * @param app
 * @param userOptions
 */
module.exports = function (app, userOptions) {

    /**
     * default options
     *
     * @type {{routesPath: string, controllersPath: string, setup: string, vars: null}}
     */
    var options = {
        routesPath       : './routes'
        , controllersPath: './controllers'
        , policyPath     : './policy'
        , processdir     : process.cwd()
        , cors           : false
        , displayRoute   : true
        , defaultAction  : 'index'
    };

    // make sure userOptions is something
    if (_.isUndefined(userOptions)) userOptions = {};

    // combine any specified options with the defaults
    _.extend(options, userOptions);

    // get route files
    var files = fs.readdirSync(options.routesPath);
    var jsonFiles = _.filter(files, function (file) {
        return path.extname(file) == '.json'
    });


    if(options.displayRoute) {
        console.log('');
        console.log(' \x1b[34m********************************* ROUTES *******************************\x1b[0m');
    }

    jsonFiles.forEach(function (file) {

        options.routeName = file.split('.')[0];
        options.basePathJson = path.join(options.processdir, options.routesPath);
        options.basePathController = path.join(options.processdir, options.controllersPath);
        options.basePathPolicy = path.join(options.processdir, options.policyPath);

        load(app, options);
    });


    if(options.displayRoute) {
        console.log(' \x1b[34m************************************************************************\x1b[0m');
        console.log('');
    }

};