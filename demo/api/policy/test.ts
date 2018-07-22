module.exports = (osseus) => {
  return {
    myfunc: (req, res, next) => {
      console.log("middleware in test policy");
      next();
    },
    a1: (req, res, next) => {
      //console.log("a");
      res.mdlwa1 = true;
      next();
    },
    a2: (req, res, next) => {
      //console.log("b");
      res.mdlwa2 = true;
      next();
    },
    a3: (req, res, next) => {
      //console.log("c");
      res.mdlwa3 = true;
      next();
    }
  }
}