'use strict';

/*
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var path = require('path');
var mongoose = require('mongoose');
var socketIOServer = require('./socket/socket');

/*
 * MongoDb configuration.
 */
var config = require('./config/config');
var validate = require('./config/validation');

/*
 * Create Express server.
 */
var app = express();
var socket = socketIOServer.createSocket(app)

/*
 * Connect to MongoDB.
 */
mongoose.connect(config.mongoDBUrl);
mongoose.connection.on('connected', function() {
  console.log('MongoDB connected succesfully at: ' + config.mongoDBUrl);
});

mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/*
 * Express configuration.
 */
app.set('port', config.port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));


/*
 * Add in our routes
 */
var home = require('./routes/home');
var user = require('./routes/user');
var product = require('./routes/product');
var form = require('./routes/form/form');
var theme = require('./routes/theme');
var employee = require ('./routes/employee');
var auth = require('./routes/auth');
var patient = require('./routes/patient');


app.use(home);
app.use('/auth', auth);
app.use('/api/*', validate);
app.use('/api', user);
app.use('/api', product);
app.use('/api', form);
app.use('/api', theme);
app.use('/api', employee);
app.use('/api', patient);

/*
 * Error Handler.
 */
app.use(errorHandler());

/*
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode',
    app.get('port'),
    app.get('env'));
});

module.exports = app;
