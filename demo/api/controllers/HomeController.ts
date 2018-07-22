module.exports = (osseus) => {
  return {
    index: (req, res) => {
      res.json({message: 'get index'});
    },
    postfunction: (req, res) => {
      res.json({message: 'post index'});
    },
    index2: (req, res) => {
      res.send('index page get');
    },
    hasmiddleware: (req, res) => {
      res.json({message: 'middleware array', "mdlw": res.mdlw});
    },
    hasmiddlewareString: (req, res) => {
      res.json({message: 'middleware string', "mdlw": res.mdlw});
    }
  }
};