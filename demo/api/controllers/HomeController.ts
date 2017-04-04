exports.index = function (req, res) {

    res.json({message: 'get index'});

};

exports.postfunction = function (req, res) {

    res.json({message: 'post index'});
};

exports.index2 = function (req, res) {

    res.send('index page get');
};

exports.hasmiddleware = function (req, res) {

    res.json({message: 'middleware array', "mdlw": res.mdlw});
};

exports.hasmiddlewareString = function (req, res) {

    res.json({message: 'middleware string', "mdlw": res.mdlw});
};