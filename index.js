const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
let x = {};

console.log("Welcome to the Employee Tracker Application!");
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
      switch (data.task) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employees":
          viewEmployees();
          break;
        case "Update Employee Role":
          viewEmployees();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "Add Role":
          viewRoles();
          break;
        case "View All Departments":
          viewDepartment();
          break;
        case "Add Department":
          viewEmployees();
          break;
      }
    });
}

function viewEmployees() {
  db.query("SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, department.name AS department, role.salary AS Salary, employee.manager_id AS Manager_ID FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;", function (err, results) {
    console.table(results);
    init();
  });
}

// function addEmployee() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "firstName",
//         message: "What is the name of the employee? ",
//       },
//     ])
//     .then((data) => {
//       const newEmployee = new Employee(data.name);
//     });
// }

// function updateRole() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "name",
//         message: "What is the name of the role? ",
//       },
//     ])
//     .then((data) => {
//       const newRole = new Role(data.name);
//     });
// }

function viewRoles() {
  db.query(
    "SELECT role.title AS Role, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

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
//       const newRole = new Role(data.name);
//     });
// }

function viewDepartment() {
  db.query("SELECT department.name AS Departments FROM department", function (err, results) {
    console.table(results);
    init();
  });
}

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
