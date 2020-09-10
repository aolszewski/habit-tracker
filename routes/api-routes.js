// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //Route getting all habits for a specific user
  app.get("/api/habit_data/:user/", (req, res) => {
    // db.Habit.findAll().then(habits => res.json(habits));
    db.Habit.findAll({
      where: {
        UserId: req.params.user
      }
    }).then(habits => {
      res.json(habits);
    });
  });

  //Route getting specific habit for a user
  app.get("/api/habit_data/:user/:id/", (req, res) => {
    db.Habit.findAll({
      where: {
        UserId: req.params.user,
        id: req.params.id
      }
    }).then(habits => {
      res.json(habits);
    });
  });

  //POST Route for saving a new habit
  app.post("/api/habit_data", (req, res) => {
    db.Habit.create(req.body).then(habits => {
      res.json(habits);
    });
  });

  app.post("/api/insert_habit", (req, res) => {
    //req.body = {
    //  name: "hobbit"
    //}

    console.log("id: " + req.body.userId);
    console.log("insert new habit: " + req.body.name);
    console.log("req.user: ", req.user);

    // if(!req.user){
    //   return res.status(401)
    // }

    db.Habit.create({
      name: req.body.name,
      completed: 0,
      // UserId: 1,
      UserId: req.user.id
    }).then(() => {
      res.redirect(301, "/habits");
    });
  });

  //DELETE Route for deleting a habit
  app.delete("/api/habit_data/:user/:id", (req, res) => {
    db.Habit.destroy({
      where: {
        UserId: req.params.user,
        id: req.params.id
      }
    }).then(habits => {
      res.json(habits);
    });
  });

  //PUT Route for updating a habit's completed field
  app.put("/api/habit_data/:user/:id", (req, res) => {
    db.Habit.update(
      { completed: true },
      {
        where: {
          UserId: req.params.user,
          id: req.params.id
        }
      }
    ).then(habitUpdated => {
      res.json(habitUpdated);
    });
  });
};
