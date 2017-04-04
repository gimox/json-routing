exports.customMdlw = function (req, res, next) {

    console.log("custom middleware");

    next();
};