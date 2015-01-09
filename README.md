Express JSON Routes
===================
Make routes much easier to use in MVC format.


This is a fork of express-json-routes https://github.com/TopTierTech/express-json-routes, it add a controller configuration
for MVC style project.

How It Works
-------------


### 1.
For each `route.js` file in your routes folder add a `route.json` file.  In this JSON file, define your routes.
```javascript
{

    // short config
    "VERB /route/path" : "action",
    "GET /simple/example" : "action",

    // extended  configuration
    "GET /example/path" : {
        "action"        : "functionName", // function/method name
        "controller"    :"controllerName" // custom controller name without .js
        "middleware"    : "fileName:functionName",
        "regex"         : true | false
    }
}
```

-   The `VERB` can be any verb that express supports (`GET`, `POST`, `PUT`, `DELETE`) and must be UPPERCASE

### 2.
In your app.js file just include the module like
```javascript

// Includes
var express     = require('express');
var routes      = require('json-routing');

...

var app = express();
// setup stuff
app.set(...);
app.use(...);

routes(app);

```


### 3.
Create a directory controllers (default ./controllers). Add a file with same .json name inside. Create your logic code

Note. export.functioname must be as declared in *.json (default "index")

```javascript

exports.index = function(req,res) {
    res.json({ code:1, message: 'hello' });
};

```


Other Options & Passing Variables
-----------------
So you want to pass variables into your routes file?  You'll love this!

When you initialize the module (step 3 above), you can specify a few options.  All are listed below with the default values.  An explaination follows.

```javascript

var routeOptions = {
    routesPath      : "./routes",
    controllerPath  : "./controllers",
    action          : "index",
    vars            : null
}

routes(app, routeOptions);

```
-  routesPath      : the path to your routes folder.
-  controllerPath  : the path to your routes folder.
-  action          : the default action (=function) you want called in your routes when they get loaded
-  vars            : an object you want passed into your setup function

For example, lets say you have a database connection you want to pass to all of your routes.


Thanks to
-----------------

express-json-routes for the work.
https://github.com/TopTierTech/express-json-routes