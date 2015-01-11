Express JSON Routes
===================
Make routes much easier to use in MVC format.
I'm searching for time a simple nodejs routing with simple configuration, good performance, minimum logic, and a MVC organization: this is json-routes.


How It Works
-------------

### 1.
In your app.js file just include the module like
```javascript

// Includes
var express     = require('express');
var routes      = require('json-routing');
var app         = express();


...

// setup stuff
app.set(...);
app.use(...);

// the important think!
routes(app);

```

### 2.
Create *.json files as you need in ./routes directory grouping routing by logical job.

For example, all users routes in a file called users.json.

In this JSON file, define your routes, you can use a short syntax or a more extended.
```javascript
{
    // short config
    "VERB /route/path" : "action",
    "GET /simple/example" : "index",
    "GET /admin*" : "index",
    "GET /form/example" : "index"
    "POST /form/example/:name" : "update",


    // extended  configuration
    "GET /example/path" : {
        "action"        : "functionName", // function/method name
        "controller"    : "controllerName" // custom controller name without .js
        "policy"        : "fileName:functionName",
        "regex"         : true | false
    }
}
```

-   The `VERB` can be any verb that express supports (`GET`, `POST`, `PUT`, `DELETE`) and must be UPPERCASE
-   Use same express4 routing syntax for address: /index, /index*, /index/:name ecc ecc.
-   action is function/method
-   controller is the logic code file (= old routes file) => basePath can be defined in global settings
-   policy is the function/class called before controller  (=  middleware) => basePath can ber defined in global settings.
if i need to call the policy file auth.js and the function check => "policy": "auth:check"



### 3.
Create a directory controllers (default ./controllers). Add a file with same .json name inside. Create your logic code

Note. export.function name must be as declared in *.json

```javascript

exports.index = function(req,res) {
    res.json({ code:1, message: 'hello' });
};

```


Other Options & Passing Variables
-----------------


When you initialize the module (step 1 above), you can specify a few options.
All are listed below with the default values.  An explaination follows.

```javascript

//define options
var routeOptions = {
    routesPath      : "./routes",
    controllerPath  : "./controllers",
    policyPath      : "./policy"
}

//init routes
routes(app, routeOptions);
```

-  routesPath      : the path to your routes folder.
-  controllerPath  : the path to your controller folder.
-  policyPath      : the path to your policy folder.


Pass global var
-----------------
We encourage to use standard tecnique for best performance: use middleware.

define a route

Routes *.json file:
```javascript
{
  "GET /complex": {
    "action": "index",
    "controller": "ComplexController",
    "policy": "test:index"
  }
}
```

Define a policy and add a vars, if we need somethink global we can define in "/*"

Policy file: ./../policy/test.js
```javascript

module.exports.index = function (req, res,next) {

    var req.globalVar = {};
    req.globalVar.applicationName = "mytestApp";

    next();
};

```


Read the value in the controller or policy
Controller file: ComplexController.js
```javascript

exports.index = function (req, res) {
    res.send(' applicationName:  ' + req.globalVar.applicationName);
};

```

Thanks to
-----------------
I start using https://github.com/TopTierTech/express-json-routes and after some time a decide to fork and change some code to do the job, thanks to express-json-routes

Relevant Changes:

- MVC, controller, policy
- remove code not usefull like custom global vars
- more customizable option
- better performance


