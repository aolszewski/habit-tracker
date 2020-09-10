// Requiring path to so we can use relative routes to our HTML files
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/habits");
    }
    res.render("signup");
    //res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/habits");
    }
    res.render("index");
    //res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  // app.get("/habits", isAuthenticated, (req, res) => {
  //   res.render("habits");
  // });

  app.get("/habits", isAuthenticated, (req, res) => {
    db.Habit.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(habits => {
      const mappedObj = habits.map(habit => habit.toJSON());
      console.log(mappedObj);
      res.render("habits", { habits: mappedObj });
    });
    //database something
  });
};
