const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
let x = {};

console.log("Welcome to the Employee Tracker Application!");
// viewEmployees();
init();

function init() {
  inquirer
    .prompt([
      {
        loop: true,
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View all Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then((data) => {
      console.log("outside if statement");
      console.log("data=", data);
      if (data === "View All Employees") {
        console.log("inside if statement");
        // viewEmployees();
        // db.query("SELECT * FROM employee", function (err, results) {
        //     console.table(results);
        //   });
      };
    });
}

function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
  });
}

// function addEmployee() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "firstName",
//         message: "What is the name of the department? ",
//       },
//     ])
//     .then((data) => {
//       const newDepartment = new Department(data.name);
//     });
// }

// function updateRole() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "name",
//         message: "What is the name of the department? ",
//       },
//     ])
//     .then((data) => {
//       const newDepartment = new Department(data.name);
//     });
// }

// function viewRoles() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "name",
//         message: "What is the name of the department? ",
//       },
//     ])
//     .then((data) => {
//       const newDepartment = new Department(data.name);
//     });
// }

// function addRole() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "title",
//         message: "What is the title of the role? ",
//       },
//       {
//         type: "input",
//         name: "salary",
//         message: "What is the salary of the role? ",
//       },
//       {
//         loop: true,
//         type: "list",
//         name: "department",
//         message: "Which department does the role belong to? ",
//         choices: ["Sales", "Engineering", "Finance", "Legal"],
//       },
//     ])
//     .then((data) => {
//       const newDepartment = new Department(data.name);
//     });
// }

// function viewDepartment() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "name",
//         message: "What is the name of the department? ",
//       },
//     ])
//     .then((data) => {
//       const newDepartment = new Department(data.name);
//     });
// }

// function addDepartment() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "name",
//         message: "What is the name of the department? ",
//       },
//     ])
//     .then((data) => {
//       const newDepartment = new Department(data.name);
//     });
// }

//import database
//use inquirer to ask questions
//use async await with the databases

//make another JS with questions?? (something to work towards)
