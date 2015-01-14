module.exports.index = function (req, res, next) {

    var message = "middleware loadeded"; // debug
    req.policy = 'middleware is loaded at ' + new Date(); // debug
    console.log('policy fired');
    req.session = {test: 1, isLogged: false};
    console.log(req.session);

    if (req.session.isLogged) {
        return res.redirect('http://' + req.hostname + ":3000/403");
    }

    next();
};


exports.all = function (req, res, next) {
    req.session = 1;
    console.log('POLICYCUSTOM test policy, all action loaded');
    next();
};


exports.check = function (req, res, next) {
    req.session = {};
    req.session.check = "ok";
    console.log('*********middleware check loaded in absolute');
    next();
};


exports.index2 = function(req,res) {

    res.send('index2 policy test');
};
