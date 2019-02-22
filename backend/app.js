//Inport .env file
require('dotenv').config();


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var epilogue = require("epilogue");
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();


/* Database configuratie */
const db = require('./app/config/db.config.js');

// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
  console.log('Drop and Resync with { force: false }');
});

var app = express();

// session support is required to use ExpressOIDC
app.use(session({
    secret: process.env.RANDOM_SECRET_WORD,
    resave: true,
    saveUninitialized: false
}));


//Initialize oauth2
const oidc = new ExpressOIDC({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    appBaseUrl: process.env.REDIRECT_URL,
    scope: 'openid profile',
    routes: {
        callback: {
            path: '/authorization-code/callback',
            defaultRedirect: '/admin'
        }
    }
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);



// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: db.sequelize
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Express configuration */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes

app.get('/rekeningen', (req, res) => {
  apiProxy.web(req, res, {target: 'http://localhost:3000'});
});
require('./app/routes.js')(app, db, epilogue, oidc);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

oidc.on('error', err => {
    // An error occurred while setting up OIDC
    console.log("oidc error: ", err);
});


module.exports = app;
