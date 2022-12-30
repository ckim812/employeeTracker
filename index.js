const inquirer = require("inquirer");
const cTable = require("console.table");
const conn = require("./db/connection");
const { exit } = require("process");

let currentRoles = [];
let currentEmployees = [];

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
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateRole();
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
  //change Manager NULL values to "N/A"
  conn.db
    .promise()
    .query("UPDATE employee SET manager_name = 'N/A' WHERE manager_id IS NULL;")
    .then(([rows, fields]) => {})
    .catch(console.log);

  //input names into manager_name using manager_id to connect with employee_id
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
                .then(([rows, fields]) => {})
                .catch(console.log);
            }
          }
        }
      }

      //print updated employee table after manager names have been updated
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
        `INSERT INTO department (name) VALUES ("${data.name}")`,
        function (err, results) {
          console.log("\nNew Department Added\n");
          viewDepartments();
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
            console.log("\nNew Role Added\n");
            viewRoles();
          }
        );
      });
  });
}

async function addEmployee() {
  const updatedRoles = await updateCurrentRoles();
  const updatedEmployees = await updateCurrentEmployees();

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
        choices: updatedRoles,
      },
      {
        loop: false,
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: updatedEmployees,
      },
    ])
    .then((data) => {
      roleID = currentRoles.indexOf(data.role) + 1;
      data.manager === "None"
        ? (managerID = null)
        : (managerID = currentEmployees.indexOf(data.manager));
      managerID++;

      //add new employee into table
      conn.db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}","${data.lastName}",${roleID},${managerID})`,
        function (err, results) {
          console.log("\nNew Employee Added\n");
          viewEmployees();
        }
      );
    });
}

async function updateRole() {
  const updatedRoles = await updateCurrentRoles();
  const updatedEmployees = await updateCurrentEmployees();

  inquirer
    .prompt([
      {
        loop: false,
        type: "list",
        name: "employee",
        message: "Which employee's role would you like to change?",
        choices: updatedEmployees,
      },
      {
        loop: false,
        type: "list",
        name: "role",
        message: "What is the employee's new role?",
        choices: updatedRoles,
      },
    ])
    .then((data) => {
      roleID = updatedRoles.indexOf(data.role) + 1;
      employeeID = updatedEmployees.indexOf(data.employee) + 1;
      conn.db.query(
        `UPDATE employee SET role_id = ${roleID} WHERE employee.id = ${employeeID};`,
        function (err, results) {
          console.log("\nEmployee Role Updated\n");
          viewEmployees();
        }
      );
    });
}

async function updateCurrentRoles() {
  //   get updated list of roles
  const [rows, fields] = await conn.promisePool.query(
    "SELECT role.title AS Role FROM role;"
  );
  currentRoles = [];
  for (let i = 0; i < rows.length; i++) {
    currentRoles.push(rows[i].Role);
  }
  return currentRoles;
}

async function updateCurrentEmployees() {
  //get updated list of employees
  const [rows, fields] = await conn.promisePool.query(
    "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last FROM employee;"
  );
  currentEmployees = [];
  for (let i = 0; i < rows.length; i++) {
    currentEmployees.push(`${rows[i].First} ${rows[i].Last}`);
  }
  return currentEmployees;
}
