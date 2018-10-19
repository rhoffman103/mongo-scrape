var express = require("express");
var db = require("../models");
var router = express.Router();

// Save An Article
router.post("/save/article", function(req, res) {
    db.Article.create(req.body)
        .then(function(dbArticle) {
            // View the added result in the console
            // console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
})

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
      db.Note.create(req.body)
      .then(function(dbNote) {
          // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
          // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          return db.Article.findOneAndUpdate(
              { _id: req.params.id },
              { note: dbNote._id },
              { new: true }
          );
      })
      .then(function(dbArticle) {
          // If we were able to successfully update an Article, send it back to the client
          res.json(dbArticle);
      })
      .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
  });

  // Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  module.exports = router;