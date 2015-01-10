exports.index = function (req, res) {

    var datetime = new Date();

    res.send(' i m complex! ' + datetime + "req:"+req.policy);
return false;
};
