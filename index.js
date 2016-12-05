var express = require('express');
var body_parser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
// var cookieSession = require('cookie-session');
var config = require('./config');
var log = require('./log');
var layouts = require('handlebars-layouts');
var hbs = require('hbs');
var fs = require('fs');

//hbs.handlebars.registerHelper(layouts(hbs.handlebars));
layouts.register(hbs.handlebars);
hbs.handlebars.registerPartial('layout', fs.readFileSync('./views/layout.hbs', 'utf8'));

require('./helpers');

var app = express();

app.set('view engine','html');
app.set('views','./views');
app.engine('html',require('hbs').__express);

app.use(passport.initialize());
passport.use(
  new BasicStrategy(function(username,password,done){
    if(username.valueOf() == 'xpto' && password.valueOf() == 'foo'){
      return done(null,true);
    }else{
      return done(null,false);
    }
  })
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(body_parser.urlencoded({limit: '10mb', extended: false}));
app.use(body_parser.json({limit: '10mb'}));
app.use(session({ secret: 'full-api', saveUninitialized: true, resave: false, cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }}));
// app.use(cookieSession({
//   name: 'cookie_session',
//   keys: ['full-api','some-other-key'],
//   secret: 'full-api', //optional if 'keys' is set
//   maxAge: 1000 * 60 * 60 * 24 * 7
// }));

app.use('/',passport.authenticate('basic',{session:false}),require('./routes'));

app.use(function(err,req,res,next){
  // Error handler
  log.info(err.message);
  log.error(err.message);

  res.status(err.status || 500).json(err.message);
});

app.listen(config.port,function(){
  console.log('Server listening to port '+config.port);
});
