const mysql = require("mysql");

let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "F1gur30ut@bl3",
    database: "habits_db"
  });
}

connection.connect(error => {
  if (error) {
    console.log("mysql connection error");
  } else {
    console.log("connected to the database");
  }
});

module.exports = connection;
