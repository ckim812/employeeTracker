const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const { exit } = require("process");

console.log("\n\nWelcome to the Employee Tracker Application!\n");
// init();
addRole();

function init() {
  inquirer
    .prompt([
      {
        loop: false,
        type: "rawlist",
        name: "task",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((data) => {
      switch (data.task) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employees":
          viewEmployees();
          break;
        case "Update Employee Role":
          viewEmployees();
          break;
      }
    });
}

//import database
//use inquirer to ask questions
//use async await with the databases

//make another JS with questions?? (something to work towards)

function viewDepartments() {
  db.query(
    "SELECT department.name AS Departments FROM department",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewRoles() {
  db.query(
    "SELECT role.title AS Role, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, department.name AS Department, role.salary AS Salary, employee.manager_id AS Manager_ID FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department? ",
      },
    ])
    .then((data) => {
      db.query(
        `INSERT INTO department (name) VALUES (${data.name})`,
        function (err, results) {
          console.log("New Department Added");
          init();
        }
      );
    });
}

function addRole() {
  db.query("SELECT name FROM department", function (err, results) {
    let currentDepartments = [];
    for (let i = 0; i < results.length; i++) {
      currentDepartments.push(results[i].name);
    }

    console.log(currentDepartments);

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role? ",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role? ",
        },
        {
          loop: true,
          type: "list",
          name: "department",
          message: "Which department does the role belong to? ",
          choices: currentDepartments,
          //   choices: ["Sales", "Engineering", "Finance", "Legal"],
        },
      ])
      .then((data) => {
        departmentID = currentDepartments.indexOf(data.department) + 1;
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${data.title}",${data.salary},${departmentID})`,
          function (err, results) {
            console.log("New Role Added");
            init();
          }
        );
      });
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
