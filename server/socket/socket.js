'use strict';

var express = require('express');
var controller = require('./patientQueue.controller');
var server;
var io = controller.createIO(server)
var port = process.env.PORT || 3000;

var bodyparser = require('body-parser');
var urlparser = bodyparser.urlencoded({extended: false});

exports.createSocket = function(app) {
    server = require('http').createServer(app);
}

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

/*
 * Registers a middleware, which is a function that gets executed for
 * every incoming Socket and receives as parameter the socket and a
 * function to optionally defer execution to the next registered
 * middleware.
 */
io.use(function(socket, next){
  if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));
});

/*
 * This handles the 'connection' event, which is send when the user is
 * trying to connect a socket.
 */
io.on('connection', function (socket) {
    // when the client emits 'add patient', this listens and executes
    // Patient is expected to be a JSON object of a Patient model.
    socket.on('add patient', function (patient) {

      // We want to add this patient to the queue.
      // Return the Json object back.

      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('patient added', patient);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('remove patient', function (patient) {
      patientId = patient._id;

      // Get the user removed from the database.

      // echo globally (all clients) that a person has connected
      // TODO: Make sure that this emits only to the users on this socket.
      socket.broadcast.emit('user joined', removedPatient);
    });
});

module.exports = server;
