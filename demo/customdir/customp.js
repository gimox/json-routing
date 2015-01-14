

exports.index = function(req,res,next) {

  console.log('************policy in custom directory');
    next();
};


exports.customaction = function(req,res) {

  res.send('ok customaction');
};
