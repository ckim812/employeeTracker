const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.PW,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect();

module.exports = db;
