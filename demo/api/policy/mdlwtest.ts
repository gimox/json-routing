exports.mdlw_a = function (req, res, next) {
    res.mdlw = true;
    next();
};