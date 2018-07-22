module.exports = (osseus) => {
  return {
    index: (req, res) => {
      res.json({message: "protected by jwt"});
    },
    indexnot: (req, res) => {
      res.json({message: "NOT protected by jwt"});
    }
  }
};