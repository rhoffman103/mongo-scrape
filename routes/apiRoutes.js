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
});

// Delete An Article and all associated Notes
router.post("/delete/article/:id", function(req, res) {
    Promise.all([
        db.Article.deleteOne( { "_id" : req.params.id }),
        db.Note.deleteMany({ "article_id" : req.params.id })
    ])
    .then( ([ dbArticle, dbNote ]) => {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Delete A Note and remove note_id from article notes array
router.post("/delete/note/:noteid/:articleid", function(req, res) {
    Promise.all([
        db.Note.deleteOne({ "_id" : req.params.noteid }),
        db.Article.findOneAndUpdate( { "_id" : req.params.articleid}, {$pull: { "notes" : req.params.noteid}} )        
      ]).then( ([ dbNote, dbArticle ]) => {
        res.json(dbNote)
      })
    .catch(function(error) {
        res.json(error);
    });
})

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.updateOne(
                { _id: req.params.id },
                // { $push: { note: dbNote }},
                { $push: { notes: dbNote._id }},
                { new: true }
            )
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
  });

  // Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({}).populate("notes")
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