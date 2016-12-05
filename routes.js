var express = require('express');
var fs = require('fs');
var router = express.Router();
var passport = require('passport');

Helper.forEachResourceFileType('routes',function(entry,file_name){
  router.use('/'+entry,require(file_name));
});

router.get('/teste',function(req,res){
  //res.json({teste:true});
  res.render('index.html',{foo:'victor'});
});

router.use(function(req,res,next){
  // Route not found
  var err = new Error('Not found');
  err.status = '404';
  next(err);
});

module.exports = router;
