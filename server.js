var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var request = require('request');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// require routes
var htmlRoutes = require('./routes/htmlRoutes');
var apiRoutes = require('./routes/apiRoutes');

var PORT = process.env.PORT || 3000;
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:root@192.168.99.100/mongooseScraper?authSource=admin";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// View Engine
app.engine("handlebars", exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.use('/', htmlRoutes);
app.use('/', apiRoutes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
