var bluebird = require('bluebird');

function HelloWorldController(){
}

HelloWorldController.prototype.index = function(req,res,next){
  res.send('aeho');
};

module.exports = new HelloWorldController();
