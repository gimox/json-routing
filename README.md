JSON Routes
===================

[![Build Status](https://travis-ci.org/gimox/json-routing.svg?branch=2.0)](https://travis-ci.org/gimox/json-routing)
[![npm version](https://badge.fury.io/js/json-routing.svg)](https://badge.fury.io/js/json-routing)
[![Coverage Status](https://coveralls.io/repos/github/gimox/json-routing/badge.svg?branch=2.0)](https://coveralls.io/github/gimox/json-routing?branch=2.0)


### THIS IS A BETA VERSION for v2.0 version

v2.0alpha1


Do not use this branch for production, check for v1.x for stable.

Version 2.x is a completly rewrite.  

- typescript code, more optimized
- more speed
- remove some unused option
- make code more extensible and simple
- prepare it for something more...... 


**Typescript**

```javascript
import {JsonRoute} from "json-route";

let routeInfo:Array<any> = new JsonRoute(app, {
    "routesPath": "./api/routes",
    "processdir": __dirname
}).start();

```

**JS ES6**

```javascript
let jsonRoute = require("json-route")

let routeInfo = new JsonRoute(app, {
    "routesPath": "./api/routes",
    "processdir": __dirname
}).start();

```

Routig with pure regular expression, add prefix "RE " before uri:

```json
{
  "RE /.*fly$/": {
    "GET": {
      "route": "index"
    }
  }
}
```

TODO: better routing with "pure regular expression" (it not concatenate global url), express route with params and regex work.

This doc's is not updated for version 2 (yet)


DOC VERSION 1 - not updated for 2!!!
-------------
Make routes much easier to use in MVC format.
I've been searching for a while for a nodejs routing solution with a:

 -  simple configuration,
 -  super performance,
 -  simple code,
 -  MVC organization,
 -  manage only routing, no other auto magic api creation
 -  customizable
 -  least possible dependency, which uses only underscore

This is: json-routes.

How It Works
-------------

**The basic concepts.**
Create a json file with your routing config and add code logic in a external file called *controller* , creating an MVC style structure.

I followed the Expressjs 4 routing standards, helping the developer to manage the routes creation and project organization faster and in the standard synthax.


Proposed Structure
-------------
This is an example of the default proposed structure, you can customize and change as you prefer.

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
- **Controller**: contains the code's logic
- **Policy**: contains the function called before the controller = middleware
- **Routes**: contains all the `*.json` routing configuration. You can create as many *.json files as you need. By default, all routes within a file look up the corresponding controller (= modules = controllers = middleware) inside the controller's default directory `./controller` (or within the directory specified by the user), which uses the following naming format: Route-name (without .json) + "Controller.js (the first letter must be capitalized)".

> **EXAMPLE:**
> If you have a definition file called `users.json`, by default the route searches the controller `UsersControllers.js`.
For routes *auth.json* all routes call the controller `AuthController.js` ecc.. ecc..



> **NOTE:**  this is a proposed structure but you can configure the module for your structure, you can change dir structure or add all routes in a single file.


### Creating JSON Configuration file
The routing file is encoded in the JSON format and by **default is in `./routes.`**

Router is created using this syntax:

`{ "RoutePath" : {"verb": {options} } }`


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
      "route": "./mycustomfolder/controllername:index",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "subfolder/test2:index"
      ],
      "cors":true
    }
  },


 ...
  more routes
}
```


### RoutePath
This is the routing path and it follows the express4 standard routing. You can use jolly character and other type syntax `/admin*,` `/admin/:name` etc. etc.;


### Verb
Relates to the call verb and can assume any valid http verbs like GET, POST, PUT, DELETE etc etc. You can add more verbs for a single routePath:

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

### Route

Relates to `file:method` to call a route address.

By default, the routing search controller file inside the default controller directory is: `./controlles`, and you can change it using the global options explained in this document.

If the controller is not set, the routing will search a file called with the same name as the json file, with "Controller" as suffix.

> **Example:**
> If you have a definition file called `users.json`, by default the route searches the controller `UsersControllers.json`.
For routes *auth.json* all routes call the controller `AuthController.js` etc.. etc..


**Summarize route params**

If you omit the route params, the system routing assumes you have a default route controller path/name and a method called "index".

If you add only a parameter, it assumes that the controller is in the default directory with standard name `nameController.js` , and the parameter is the method that should be called. example route: "testall"

If the route params contain both values `controllername:method` (user:index) it will search the controller using the default directory path structured as controller name followed by method. For example, route: "user:index" searches for a controller called user.js with method index.

If you **need to call a controller in a subfolder**, simply add the path before the controller name. Example route: "/afolder/user:index", fire ./controller/afolder/user.js with method index.

If you **need to call a controller starting to your project root** simply add `.` before the path. Example route: "./lib/user:index", fire  ./lib/user.js with method index.



### Policy

Is a module/function called before the controller (= middleware), by default it calls a file in ./policy named as you set in parameters "fileName" and a function named as you set in "functionName".

Example: policy: "auth/index" calls ./policy/auth.js and method index

**The syntax is the same as `route` params**

It can be a string for a single policy or an array for multiple policy files.


### CORS
Enable or disable Cross-origin resource sharing. default is false and disabled.


### Regex
You can set a regex to validate your route, however I discourage using it. Instead, I prefer to add this logic in the controller for better code speed.
```javascript
{
"/admin": {
    "GET": {
      "route": "action",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "subfolder/test2:index"
      ],
      "regex" : true | false
    }


}
```






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
When you initialize the module, you can specify a few options to customize the directory structure.
All are listed below with the default values.  An explanation follows.

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
    policyPath      : "./policy",
    cors            : false,
    displayRoute    : true,
    defaultAction   : "index"
}

//init routes
routes(app, routeOptions);
```

-  routesPath      : the path to your routes folder. `Default ./routes`
-  controllerPath  : the path to your controller folder. `Default ./controllers`
-  policyPath      : the path to your policy folder. `Default ./policy`
-  cors            : enable cross origin resource sharing for all routes. (more cors options coming soon..). `Default false`
-  displayRoute    : display in console loading route info, `default true`.
-  defaultAction   : the function called in route if not specified. It's not so useful, but it's here!.`Default index`

If you omit routeOptions or some params it use defaults values.

Change json file Global Options
-----------------
If you need to change options for all routes only for a specific *.json file, you can set in your file the key `GLOBAL` as in the following example:

user.json
```javascript
{
  "GLOBAL": {
    "controllerPath": "./customdir",
    "controller": "test",
    "policyPath":"./lib",
    "policy":["config:setall","config:connection"],
    "baseUrl":"/user"
  },
   "/create": {
    "PUT": {
      "route": "index",
      "policy": [
        "auth:check",
        "auth:adduserparams"
      ]
    }
  }

}
```
Example: route controller is ./customdir/UserController.js

- controllerPath: set a controller path for all routing file
- controller: set a custom name controller for all routing file
- policyPath: set a custom base policy dir for all rout
- policy: is an array of policy `file:action` to fire before controller
- baseUrl: is a base path for all url routes in file. Example, inside a file all routes start with `/api/*`, i can set base url as `/api`. Now all file routes start with `/api`. If i have a routes `/users`, it fired when user called `/api/users`


> **NOTE:**  the key "GLOBAL" must be uppercase.



Full extended example
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
    , cors: false
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
This is the main file, we set routing and add global setting to use ./api as root directory



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
Let me explain this policy: it checks if a user is logged, else set a redirect, so we can use the middleware to check ACL, authorization or get/set global vars, and this is very useful.





Create a Policy File and Pass vars to controller
-----------------
We encourage to use standard tecnique for best performance: use middleware.
using the full example described below we can create a standard policy file to attach a global var using `req`

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

Case: using middleware
-----------------

A special case: if we want to add an authentication before some route, take a look at this example:

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
      "route": "getItem",
      }
  },
   "/admin/user": {
    "GET": {
      "route": "find",
    },
     "PUT": {
      "route": "create",
    }
  }

}}
```
All `admin*` route calls the controller `auth`, so now `auth:check` is executed before all `admin*` controller and it becomes
 a policy (=middleware) and for a clear structure i put the file in policy dir.


An alternative example use the global file option:

```javascript
{
 "GLOBAL": {
    "policy":["auth:check"],
    "baseUrl":"/admin"
  },
  
   "/dashboard": {
    "GET": {
      "route": "getItem",
      }
  },
   "/user": {
    "GET": {
      "route": "find",
    },
     "PUT": {
      "route": "create",
    }
  }

}}
```
Changelog 0.1.5
-------------
- Preparing for typescript... es6 and node > 6.4 rewrite, removed underscore. No esternal modules deps!!

Changelog 0.1.0
-------------
- minor fix

Changelog 0.1.0
-------------
- removed not working cors features for file definition and route... working on it.. cors for global setting work good.

Changelog 0.0.27
-------------
- improve log info

Changelog 0.0.26
-------------
- add `defaultAction`, not so useful, but it's here!.
- start cleaning code
- add `CORS` Global file options, to enable CORS only in specific *.json routes
- add `CORS` for specific routes.
- route log info display CORS status

Changelog 0.0.25
-------------
- improve route info on load, it can disabled with global options "displayRoute:false"

Changelog 0.0.24
-------------
- initial CORS support (look at "Change default Options"), more CORS options coming soon...

Changelog 0.23
-------------
- fix url union for windows platform

Changelog 0.0.20
-------------
- fix policy string is not added if global policy is set
- working test

Changelog 0.0.19
-------------
- add Global base Url

Changelog 0.0.17
-------------
- fix default route
- add mre error check

Changelog 0.0.15
-------------
- add goblal file policy (=middleware)

Changelog from version 0.0.13
-------------
- No longer compatible with <0.13 version
- new json syntax
