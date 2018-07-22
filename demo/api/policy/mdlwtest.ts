module.exports = (osseus) => {
  return {
    mdlw_a: (req, res, next) => {
      res.mdlw = true;
      next();
    }
  }
}