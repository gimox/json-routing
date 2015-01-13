Express JSON Routes
===================
Make routes much easier to use in MVC format.
I'm searching for time a simple nodejs routing with:

 -  simple configuration,
 -  super performance,
 -  simple code
 -  MVC organization,
 -  manage only routing, no other auto magic api creation
 -  customizable
 -  less possible dependency, it has only underscore

this is json-routes.

Changelog from version 0.12
-------------
- It break compatibility with <0.11 version
- new json syntax


How It Works
-------------

**The basic concepts.**
Create a json file with your routing config and add code logic in a external file called *controller*  creating a MVC style structure.

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
- **Controller**: contains the logic code
- **Policy**: contain function called before controller = middleware
- **Routes**: this folder contain all `*.json` routing configuration. You can create many *.json file as you need. by default all routes inside a file search for a logic code (= modules = controllers) inside `./controller`, named as *.json + suffix  "Controller.js (the first letter must be capitalized)".


> **NOTE:**  this is a proposed structure but you can configure the module for your structure, you can chagne dir structure or add all routes in a single file.


### Creating JSON Configuration file
Routing file is encoded in JSON format and by **default is in `./routes.`**

Router is created using this syntax:

`"RoutePath" : {"verb": {options}`


*Example of extended config*

```javascript
{
   "routePath": {
    "VERB": {
      "route": "controller:method",
      "policy": [
        "controller:method",
      ]
    }
  },

  "/admin": {
    "GET": {
      "route": "action",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "subfolder/test2:index"
      ]
    },
    "POST": {
      "route": "index",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "subfolder/test2:index"
      ]
    }
  },


 ...
  more routes
}
```


###RoutePath
Is the routing path and follow the express4 standard routing, you can use jolly caracter and other type syntax `/admin*,` `/admin/:name` ecc. ecc.;


###Verb
Rappresent the call verb and can assume any valid https verbs like GET, POST, PUT, DELETE ecc ecc. You can add more verbs for a single routePath:

```javascript
{
"/admin": {
    "GET": {
      "route": "action",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "subfolder/test2:index"
      ]
    },
    "POST": {
      "route": "action",
      "policy": [
        "test:all",
      ]
    }

}
```

`/admin` has GET and POST  verbs.

###Route

Rappresent `file:method` to call for a route address.

By default the routing search file inside the default controller directory: `./controlles`,
you can change it using global option explained in this documents.
If controller is not set it search a file called with the same name of json file with "Controller" suffix.

> **Example:**
> If you have a definition file called `users.json`, by default the route search the controller `UsersControllers.json`.
For routes *auth.json* all routes call the controller `AuthController.js` ecc.. ecc..


**Summarize route params**


if you omit route params, system assume you have a default route cotroller path/name and a method called "index".

if you add only a parameter, it assume that controller is in default directory with standard name `nameController.js`. example route: "testall"

if route contains the controller params `controllername:method` (user:index) it search the controller inside default directory with controller and method specified. route: "user:index", search a controller called user.js with method index.

if you **need to call a controller in a subfolder**, simply add the path before controleller name. Example route: "/afolder/user:index", fire  ./controller/afolder/user.js with method index.

if you **need to call a controller starting to your project root** simply add `.` before the path. Example ropute: "./lib/user:index", fire  ./lib/user.js with method index.



###Policy

Is a modules/function called before the controller (= middleware), by default it call a file in ./policy named as you set in parameters "fileName" and a function named as you set in "functionName".

**The syntax is the same as `route` params**

It can be a string for a single policy or array for more policy file.




###Regex
 you can set a regex to validate your route, i discourage use it and i prefer add this logic in the controller for a better code speed.




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


Change json file Global Options
-----------------
if you need to change a option only for all routes inside a *.json file, you can set in your file the key `GLOBAL` as in example:

user.json
```javascript
{
  "GLOBAL": {
    "controllerPath": "./customdir",
    "controller": "test",
    "policyPath":"./lib"
  },
   "/user": {
    "GET": {
      "route": "index",
      "policy": [
        "auth:check",
        "auth:adduserparams"
      ]
    }
  }

}
```
only for user.json routes the default setting are changed as in global.
Example: route controller is ./customdir/UserController.js




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
```javascript
{
   "/banned": {
    "GET": {
      "route": "bannedCustom:index",
      }
  },
   "/user": {
    "GET": {
      "route": "find",
      "policy": [
        "auth:check",
        "auth:adduserparams"
      ]
    },
     "PUT": {
      "route": "create",
      "policy": [
        "auth:check",
      ]
    }
  }

}
```
define the routes


*./api/controllers/UsersController.js*
```javascript
exports.index = function(req,res,next) {
    res.send(' index routes ');
};

exports.create = function(req,res,next) {
    res.send(' create routes params:'+req.params.name);
};
```
a basic controller logic

*./api/controllers/bannedCustom.js*
```javascript
exports.getbanned = function(req,res,next) {
    res.send(' custom controller name ');
};
```
this is the controller with custom name


*./api/policy/auth.js*
```javascript
exports.check = function(req,res,next) {
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
    res.send(' custom controller name, middleware loaded at: '+req.session.lastPing);
};
```

Case: middleware as middleware
-----------------

A special case: if we want to add an authentication before some route, take a look at this example

```javascript
{

 "/admin*": {
    "GET": {
      "route": "./policy/auth:check",
     },
    "POST": {
      "route": "auth:check",
     },
    "PUT": {
      "route": "auth:check",
     },
    "DELETE": {
      "route": "auth:check",
    },
  },

   "/admin/dashboard": {
    "GET": {
      "route": "item:get,
      }
  },
   "/admin/user
   ": {
    "GET": {
      "route": "find",
    },
     "PUT": {
      "route": "create",
    }
  }

}}
```
All `admin*` route call the controller `auth`, so now `auth:check` is executed before all `admin*` controller and it become a policy (=middleware) and for a clear structure i put the file in policy dir.
