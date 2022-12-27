const inquirer = require("inquirer");
const cTable = require("console.table");
const conn = require("./db/connection");
const { exit } = require("process");

console.log("\n\nWelcome to the Employee Tracker Application!\n");
init();

function init() {
  inquirer
    .prompt([
      {
        loop: false,
        type: "list",
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

function viewDepartments() {
  conn.db.query(
    "SELECT department.name AS Departments FROM department",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewRoles() {
  conn.db.query(
    "SELECT role.title AS Role, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewEmployees() {
  conn.db
    .promise()
    .query("UPDATE employee SET manager_name = 'N/A' WHERE manager_id IS NULL;")
    .then(([rows, fields]) => {
      //   console.log(rows);
    })
    .catch(console.log);

  conn.db.query(
    "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, department.name AS Department, role.salary AS Salary, employee.manager_id AS ManagerID, employee.manager_name AS Manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY ID;",
    function (err, results) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].ManagerID !== "NULL") {
          for (let j = 0; j < results.length; j++) {
            if (results[i].ManagerID === j + 1) {
              conn.db
                .promise()
                .query(
                  `UPDATE employee SET manager_name = '${results[j].First} ${
                    results[j].Last
                  }' WHERE manager_id = ${j + 1};`
                )
                .then(([rows, fields]) => {
                  // console.log(rows);
                })
                .catch(console.log);
            }
          }
        }
      }
      conn.db.query(
        "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, department.name AS Department, role.salary AS Salary, employee.manager_name AS Manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY ID;",
        function (err, results) {
          console.table(results);
          init();
        }
      );
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
      conn.db.query(
        `INSERT INTO department (name) VALUES (${data.name})`,
        function (err, results) {
          console.log("New Department Added");
          init();
        }
      );
    });
}

function addRole() {
  conn.db.query("SELECT name FROM department", function (err, results) {
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
        conn.db.query(
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
  conn.db.query(
    "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Role, employee.manager_id AS Manager_ID FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, results) {
      let currentRoles = [];
      for (let i = 0; i < results.length; i++) {
        currentRoles.push(results[i].Role);
      }
      let currentEmployees = ["0"];
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
          conn.db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}","${data.lastName}",${roleID},${managerID})`,
            function (err, results) {
              console.log("\nNew Employee Added\n");
              viewEmployees();
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
