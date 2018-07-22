module.exports = (osseus) => {
  return {
    validateparam: (req, res) => {
      res.json({message: 'validate params'});
    }
  }
};