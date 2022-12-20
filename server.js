const express = require("express");
const mysql = require("mysql2");
const db = require("./db/connection");
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', api);

// Query database
db.query('SELECT * FROM department', function (err, results) {
    // console.log(results);
    console.log("select from dep");
  });
db.query('SELECT * FROM employee', function (err, results) {
    // console.log(results);
    console.log("select from emp");
  });
db.query('SELECT * FROM role', function (err, results) {
    // console.log(results);
    console.log("select from role");
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});