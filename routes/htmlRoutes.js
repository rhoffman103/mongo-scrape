var express = require("express");
var db = require("../models");
var cheerio = require("cheerio");
var router = express.Router();
var request = require("request");

// Home Page
router.get("/", (req, res) => {
    db.Article.find({}).then(dbArticles => {
        console.log(dbArticles);
        res.render("index", {
            articles: dbArticles,
            saved: true
        });
    });
});

// A GET route for scraping the echoJS website
router.get("/scrape/hackernews", function(req, res) {
  request("https://thehackernews.com//", function(error, response, html) {
    // load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    var articles = [];

    // grab every h2 within an article tag, and do the following:
    $(".body-post").each(function(i, element) {
        var post = $(element);
        var title = post
            .find(".home-title")
            .text();
        var link = post
            .children(".story-link")
            .attr("href");
        var image = post
            .find(".home-img-src")
            .attr("src");
        var summary = post
            .find(".home-desc")
            .text();

        // console.log(image);
        
        articles.push({
            link: link,
            title: title,
            image: image,
            summary: summary
        });
    });

    // res.json(articles);
    res.render("index", {
        articles: articles,
        hacker: true
    })
  });
});

// A GET route for scraping the echoJS website
router.get("/scrape/echojs", function(req, res) {
  request("http://www.echojs.com/", function(error, response, html) {
    // load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    var articles = [];

    // grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object

      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      var title = $(element)
        .children("a")
        .text();
      var link = $(element)
        .children("a")
        .attr("href");

      console.log("title: " + title);
      console.log("link: " + link);

      articles.push({
        title: title,
        link: link
      });
    });

    res.render("index", {
        articles: articles,
        echo: true
    })
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = router;
