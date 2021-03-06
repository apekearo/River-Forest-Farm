// *********************************************************************************
// cropData-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the posts
  app.get("/api/crops", function (req, res) {
    var query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    // console.log(Object.keys(db));
    db.Crop.findAll({
      where: query,
      include: [db.Author]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/crops/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Crop.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Author]
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  app.post("/api/crops", function (req, res) {
    db.Crop.create(req.body).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/crops/:id", function (req, res) {
    db.Crop.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/crops", function (req, res) {
    db.Crop.update(
      req.body, {
        where: {
          id: req.body.id
        }
      }).then(function (dbPost) {
      res.json(dbPost);
    });
  });
};