#!/usr/bin/env node

import '@babel/polyfill'


console.log('Starting env ' + process.env.ENV)
if(['DEV', 'PROD', 'TEST'].includes(process.env.ENV.toUpperCase()) === false){
  throw "ENV mussed be filled with either PROD or DEV or TEST";
}
const env_http_port = (process.env.ENV === 'DEV' ? 3001 : 3001)
const env_https_port = (process.env.ENV === 'DEV' ? 3002 : 3002)

/**
 * Settings
 */
const settings = {
  http_redirect: true,
  load_certs: true,
  cert_key_path: './config/sslcert/privkey.pem',
  cert_cert_path: './config/sslcert/fullchain.pem'
}
if(process.env.LOAD_CERTS !== undefined && process.env.LOAD_CERTS === 'FALSE'){
  settings.http_redirect = false
  settings.load_certs = false
}

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
if(settings.load_certs){
  var options = {
    key  : fs.readFileSync(settings.cert_key_path),
    cert : fs.readFileSync(settings.cert_cert_path)
  };
}


app.set("port",env_https_port);

/**
 * Create HTTP server.
 */

var server = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(env_https_port);
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
    ? 'Pipe ' + http_port
    : 'Port ' + http_port;

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
  }).listen(env_http_port);
}



