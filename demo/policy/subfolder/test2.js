exports.index = function (req, res, next) {
    req.session = 1;
    console.log('middleware in subfolder');
    next();
};