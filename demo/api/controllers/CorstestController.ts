exports.index = (req, res) => {
    res.json({message: "has cors"});
};

exports.indexnot = (req, res) => {
    res.json({message: "no cors here"});
};