module.exports = (osseus) => {
  return {
    customMethod: (req, res) => {
      res.json({message: 'custom controller'});
    }
  }
};