module.exports = (osseus) => {
  return {
    index: (req, res) => {
      res.json({message: "has cors"});
    },
    indexnot: (req, res) => {
      res.json({message: "no cors here"});
    }
  }
};