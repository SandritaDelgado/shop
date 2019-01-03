var debug = require('debug')('webpractica:app');
var error = require('debug')('webpractica:app:error');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var shopRouter = require('./routes/shop');
var restRouter = require('./routes/rest');
var passportRouter = require('./routes/passport');

require('./config/database');
require('./config/mongoose');
require('./config/passport');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(['/shop/views', '/shop/views/'], shopRouter);
app.use('/shop/rest', restRouter);
app.use('/shop/passport', passportRouter);

module.exports = app;