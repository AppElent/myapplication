#!/usr/bin/env node
require('dotenv').config();
import '@babel/polyfill'


console.log('Starting env ' + process.env.NODE_ENV)
if(['DEV', 'PROD', 'TEST', 'PRODUCTION'].includes(process.env.NODE_ENV.toUpperCase()) === false){
  throw "NODE_ENV mussed be filled with either PROD or DEV or TEST";
}
//const https_port = process.env.PORT || 3002;
//const http_port = process.env.PORT || 3001;
//const env_https_port = (process.env.ENV === 'DEV' ? 3002 : 3002)

/**
 * Settings
 */
const all_settings = {
  "HEROKU": {
    http_redirect: false,
    load_certs: false,
    http_port: process.env.PORT,
    https_port: 3002
  },
  "RASPBERRY":{
    http_redirect: false,
    load_certs: true,
    cert_key_path: './config/sslcert/privkey.pem',
    cert_cert_path: './config/sslcert/fullchain.pem',
    http_port: 3001,
    https_port: 3002
  },
  "WINDOWS": {
    http_redirect: true,
    load_certs: false,
    http_port: 3001,
    https_port: 3002
  }
}
const settings = all_settings[process.env.SETTING];

if(settings === undefined) throw "You have to provide a config."


/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('backend:server');
var http = require('http');
var fs = require('fs');
var https = require('https');

/**
 * Get port from environment and store in Express.
 */  

//var http_port = normalizePort(process.env.PORT || '3001');
//var https_port    =   process.env.PORT_HTTPS || 3002; 
var options = {}
if(settings.load_certs){
  options = {
    key  : fs.readFileSync(settings.cert_key_path),
    cert : fs.readFileSync(settings.cert_cert_path)
  };
}


app.set("port",settings.https_port);

/**
 * Create HTTP server.
 */

var server = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(settings.https_port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof http_port === 'string'
    ? 'Pipe ' + settings.http_port
    : 'Port ' + settings.http_port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// Redirect from http port to https
if(settings.http_redirect){
  http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(settings.http_port);
}else{
  app.listen(settings.http_port);
}





