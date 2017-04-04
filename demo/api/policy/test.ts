exports.myfunc =  (req, res, next) => {

    console.log("middleware in test policy");

    next();
};

exports.a1 = (req, res, next) => {
    //console.log("a");
    res.mdlwa1 = true;
    next();
};

exports.a2 = (req, res, next) => {
    //console.log("b");
    res.mdlwa2 = true;
    next();
};

exports.a3 = (req, res, next) => {
    //console.log("c");
    res.mdlwa3 = true;
    next();
};