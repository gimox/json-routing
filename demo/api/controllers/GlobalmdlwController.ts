module.exports = (osseus) => {
  return {
    index: (req, res) => {
      res.json({message: 'index other', ma: res.mdlwa1, mb: res.mdlwa2, mc: res.mdlwa3});
    }
  }
};