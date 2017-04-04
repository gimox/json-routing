exports.customMdlw = (req, res, next) => {
    res.mdlw = true;
    next();
};