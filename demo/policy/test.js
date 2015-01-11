module.exports.index = function (req, res,next) {

    var message = "middleware loadeded"; // debug
    req.policy = 'middleware is loaded at '+new Date(); // debug

    console.log('policy fired');

    req.session = {test:1,isLogged: false};
    console.log(req.session);

   if (req.session.isLogged){



       return  res.redirect('http://'+req.hostname+":3000/403");

}

    next();
};