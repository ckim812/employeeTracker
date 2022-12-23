const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const { exit } = require("process");

console.log("\n\nWelcome to the Employee Tracker Application!\n");
// init();
viewEmployees();

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
          addEmployee();
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
    "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, department.name AS Department, role.salary AS Salary, employee.manager_name AS Manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY ID;",
    function (err, results) {
      updatedEmployees = [];

      db.query(
        "UPDATE employee SET Manager = 'None' WHERE manager_id IS NULL;",
        function (err, results) {
            console.log(results);
        }
      );

      for (let i = 0; i < results.length; i++) {
        console.log(i);
        console.log(results[i].First);
        db.query(
          "UPDATE employee SET Manager =" +
            `${results[i].First} ${results[i].Last}` +
            "WHERE manager_id =" +
            `${i + 1}`,
          function (err, results) {
            console.log(results);
          }
        );
      }

      console.log(results);
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
          loop: false,
          type: "list",
          name: "department",
          message: "Which department does the role belong to? ",
          choices: currentDepartments,
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

function addEmployee() {
  db.query(
    "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, employee.manager_id AS Manager_ID FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, results) {
      let currentRoles = [];
      for (let i = 0; i < results.length; i++) {
        currentRoles.push(results[i].Role);
      }
      let currentEmployees = ["None"];
      for (let i = 0; i < results.length; i++) {
        currentEmployees.push(`${results[i].First} ${results[i].Last}`);
      }
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name? ",
          },
          {
            loop: false,
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: currentRoles,
          },
          {
            loop: false,
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: currentEmployees,
          },
        ])
        .then((data) => {
          roleID = currentRoles.indexOf(data.role) + 1;
          data.manager === "None"
            ? (managerID = null)
            : (managerID = currentEmployees.indexOf(data.manager));
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}","${data.lastName}",${roleID},${managerID})`,
            function (err, results) {
              console.log("New Employee Added");
              init();
            }
          );
        });
    }
  );
}

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
