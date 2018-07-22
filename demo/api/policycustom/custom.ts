module.exports = (osseus) => {
  return {
    customMdlw: (req, res, next) => {
      res.mdlw = true;
      next();
    }
  }
}