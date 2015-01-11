Express JSON Routes
===================
Make routes much easier to use in MVC format.
I'm searching for time a simple nodejs routing with:
 
 -  simple configuration,
 -  good performance, 
 -  MVC organization

this is json-routes.


How It Works
-------------

**The basic concepts.**
Create a json file with your routing config and add code logic in a externale file creating a MVC style structure.

I follows the Expressjs 4 routing standards, helping the developer to speedy the routes creation and organization.


Proposed Structure
-------------
This is an example of default proposed structure, you can customize and change as you preferred.

```
project root
├── controllers/
│   ├── IndexController.js
│   ├── AuthController.js
│   ├── UsersController.js
├── policy/
│   │   ├── AuthorizationPolicy.js
│   │   ├── mymiddleware.js
├── routes/
│   │   │   ├── auth.json
│   │   │   ├── users.json
│   │   │   ├── index.json
├── app.js/
├── package.json/
├── README.md/
```

- routes: this folder contain all `*.json` routing configuration. You can create many *.json file as you need. by default all routes inside a file search for a logic code (= modules = controllers) inside `./controller`, named as *.json + suffix  "Controller.js (the first letter must be capitalized)". 

> **Example:** 
> If you have a definition file called `users.json`, by default the route search the controller `UsersControllers.json`. 
For routes *auth.json* all routes call the controller `AuthController.js` ecc.. ecc..


### Configure the routing file 
Routing file is encoded in JSON format and by default is in ./routes.
You can configure the routing with 2 type of syntax:

- simple
- extended

**Simple**
Router is created using this syntax: `"VERB path" : "action"`

*Example of simple config*
```json
{
 "GET /users" : "index",
 "PUT /users/" : "create",
 "POST /users/:name" : "update",
 ...
 add more route as you need
}
```
- VERB:  must by uppercase and can be GET, POST, PUT, DELETE ecc ecc;
- path: is the routing path and follow the express4 standard routing, you can use jolly caracter and other type syntax `/admin*,` `/admin/:name` ecc. ecc.;
- action: is the function/method to fire when the routes is called. remember that the logic file (=controller) creation is explained in "Proposed Structure" documentation, and you can change it if you need.


**Extended**
Router is created using this syntax: `"VERB path" : {}

*Example of extended config*
```json
{
  "GET /user/whoiam" : {
        "action"        : "myinfo", // function/method name
        "controller"    : "users" // custom controller 
        "policy"        : "fileName:functionName",
        "regex"         : true | false
    }
...
}
```
The initial syntax is the same as simple but now the second parameters is not a string but a JSON definition,  let me explain the options:

- `action`: the same as simple config;
- `controller`: a custom controller name, the standard follows this conventions: jsonroutesname+Controller.js (camel case), but if you need to call a controller named userlogin and not UserController;
- `policy:` is a modules/function called before the controller (= middleware), by default it call a file in ./policy named as you set in parameters "fileName" and a function named as you set in "functionName"
- `regex`:  you can set a regex to validate your route, i discourage use it and i prefer add this logic in the controller for a better code speed.

> **Note:**  you can add simple and extended funtion in the same file as you need




### Init Module

Configure the routing modules in your main js file, as any other nodes modules. 

```javascript
// Includes
var express     = require('express');
var app         = express();
var routes      = require('json-routing'); // add module

...

// your code..
app.set(...);
app.use(...);

// this is the magic!
routes(app); //init modules

```


Change default Options 
-----------------
When you initialize the module, you can specify a few options to customize directory structure.
All are listed below with the default values.  An explaination follows.

your main.js file
```javascript
// Includes
var express     = require('express');
var app         = express();
var routes      = require('json-routing'); // add module

// your code..
app.set(...);
app.use(...);

//define routes default options
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


Full example
-----------------

*app.js*
```javascript
var express = require('express')
    , app = express()
    , port = process.env.PORT || 3000
    , routing = require('./lib/route');

/**
 * global options for routing
 *
 * set all file inside /api/* for a more cleaner code
 */
var routeOptions = {
    routesPath: "./api/routes"
    , controllersPath: "./api/controllers"
    , policyPath: './api/policy'
};

/**
 * init json-routing
 */
routing(app, routeOptions);

/**
 * standard express 4 routing
 * yes.. you can use both routing together if you need
 */
var router = express.Router();
router.get('/express/', function (req, res) {
    res.send(' this is a standard routing ');
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
```
this is the main file, we set routing and add global setting to use ./api as root directory


*./api/routes/users.json*
```json
{
  "GET /users" : "index",
  "POST /users/:id" : "update",
  "GET /users/banned" : {
        "action"        : "getbanned", // function/method name
        "controller"    : "bannedCustom" // custom controller 
        "policy"        : "auth:check",
        "regex"         : true | false
    }
...
}
```
define the routes using simple and extended configuration.


*./api/controllers/UsersController.js*
```javascript
exports.index = function(req,res,next) {
    res.send(' index routes ');
};

exports.update = function(req,res,next) {
    res.send(' update routes params:'+req.params.id);
};
```
a basic controller logic

*./api/controllers/bannedCustom.js*
```javascript
exports.getbanned = function(req,res,next) {
    res.send(' this is a route inside users that has a custom controller ');
};
```
this is the controller with custom name


*./api/policy/auth.js*
```javascript
exports.getbanned = function(req,res,next) {
    if (!req.session.isLogged){
	     return  res.redirect('http://'+req.hostname+":3000/403");
    }
    next();
};
```
Let me explain this policy: it check if a user is logged, else set a redirect, so we can use the middleware to check ACL, authorization or get/set global vars, and this is very useful.





Set global var
-----------------
We encourage to use standard tecnique for best performance: use middleware.
using the full example described above we can change the policy file to attach a global var.

*./api/policy/auth.js*
```javascript
exports.getbanned = function(req,res,next) {
    if (!req.session.isLogged){
	     return  res.redirect('http://'+req.hostname+":3000/403");
    }
    //use req
    req.session.lastPing = new Date();
    next();
};
```


**Read the value in the controller or policy**

*./api/controllers/bannedCustom.js*
```javascript
exports.getbanned = function(req,res,next) {
    res.send(' this is a route inside users that has a custom controller, middleware loaded at: '+req.session.lastPing);
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