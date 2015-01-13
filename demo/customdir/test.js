exports.index = function(req,res) {

    res.send('custom controllername');
};



exports.check = function (req, res, next) {
    req.session = {};
    req.session.check = "ok";
    console.log('middleware check loaded');
    next();
};