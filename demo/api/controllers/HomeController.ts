exports.index = (req, res) => {
    res.json({message: 'get index'});
};

exports.postfunction = (req, res) => {
    res.json({message: 'post index'});
};

exports.index2 = (req, res) => {
    res.send('index page get');
};

exports.hasmiddleware = (req, res) => {
    res.json({message: 'middleware array', "mdlw": res.mdlw});
};

exports.hasmiddlewareString = (req, res) => {
    res.json({message: 'middleware string', "mdlw": res.mdlw});
};