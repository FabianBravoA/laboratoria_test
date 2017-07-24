var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Passport = require('passport');
var AuthMiddleware = require('./auth/authmiddleware');
var LocalSignUp = require('./auth/localsignup');
var LocalSignIn = require('./auth/localsignin');

//Routes
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var wall  = require('./routes/wall'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://Laboratoria:Cxhfc4a9ANkrMX3i@laboratoria-shard-00-00-uarhm.mongodb.net:27017,laboratoria-shard-00-01-uarhm.mongodb.net:27017,laboratoria-shard-00-02-uarhm.mongodb.net:27017/laboratoria?ssl=true&replicaSet=Laboratoria-shard-0&authSource=admin');

//Passport initialization
app.use(Passport.initialize());
Passport.use('local-signup', LocalSignUp);
Passport.use('local-login', LocalSignIn);


//Auth middleware, no-one can see api endpoints unless is someone registered and authentified
app.use('/api', AuthMiddleware);
app.use('/api/users', users);
app.use('/api/wall', wall);
app.use('/login', login);

app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
