exports.index = function (req, res) {
    res.send('OK complex');
};

exports.onlyaction = function (req, res) {
    res.send('OK onlyaction');
};

exports.all = function (req, res, next) {
   //res.send('OK all');
  req.session= 1;

    next();
};