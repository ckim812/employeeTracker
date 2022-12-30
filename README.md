# employeeTracker

## Description

```
The goal of this project was to create an application to manage a company's employee database in the terminal.
```

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Table of Contents

- [Link to video](#link-to-video)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Credits](#credits)

## Link-to-video

[https://app.castify.com/view/0e59f4ce-22e5-41cc-b1ef-30d074346726](https://app.castify.com/view/0e59f4ce-22e5-41cc-b1ef-30d074346726)

## Usage

```
Type "npm i" to install Inquirer and Console.table
Type "node index.js" when you are in the root directory
Choose a task: View All Departments, View All Roles, View All Employees, Add a Department, Add a Role, Add an Employee, or Update an Employee Role.
Fill in the necessary information, if required, after selecting a task.
Press "ctrl-c" to exit the app.
```

## Technologies-Used

```
Node.js, Inquirer, and MySQL
```

## Credits

```
Created by Charles Kim.
