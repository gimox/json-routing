exports.myfunc = function (req, res, next) {

    console.log("middleware in test policy");

    next();
};

exports.a1 = function (req, res, next) {

    console.log("policy a1");

    next();
};

exports.a2 = function (req, res, next) {

    console.log("policy a2");

    next();
};