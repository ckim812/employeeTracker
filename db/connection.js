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

const pool = mysql.createPool(
  {
    host: "localhost",
    user: "root",
    password: process.env.PW,
    database: "employee_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  console.log(`Connected pool to the employee_db database.`)
);

const promisePool = pool.promise();

db.connect();

// module.exports = db;
module.exports = { db: db, pool: pool, promisePool: promisePool };
