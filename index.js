const inquirer = require("inquirer");
const consoleTable = require("console.table");

function init() {
  inquirer
    .prompt([
      {
        loop: true,
        type: "list",
        name: "newEmployee",
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
    .then((data) => {});
}

//view all employees function

//add employees function
// function addEmployee

//update employee role function

//view all roles function

//add role function

//view all departments function

//add department function

//import database
//use inquirer to ask questions
//use async await with the databases

//make another JS with questions?? (something to work towards)
