exports.index = (req, res) => {
    res.json({message: 'protected bny jwt'});
};

exports.indexnot = (req, res) => {
    res.json({message: 'NOT protected by jwt'});
};