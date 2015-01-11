exports.index = function (req, res) {
    res.send('OK complex ' + new Date());
};

exports.onlyactio = function (req, res) {
    res.send('OK onlyaction');
};

exports.test = function (req, res) {
    res.send('OK onlyaction');
};

exports.all = function (req, res, next) {
    //res.send('OK all');
    req.session = 1;
    console.log('middleware loaded');

    next();
};

exports.checkpolicy = function (req, res) {
    res.send('OK checkpolicy: '+ req.session.check );
};