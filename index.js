// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

// require all packages
const mysql = require('mysql2');


const inquirer = require('inquirer');
const cTable = require('console.table');

// Array of current employees
// Needs a function to push employees to array every time they are created, would also need a way to create this array by reading teh employees table
let allEmployees = [];

const db = mysql.createConnection(
    {
        host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'empTracker_db'
    },
    console.log(`Connected to employee tracker database`)
);

// Initial list of prompts when user starts the application or returns to main menu
const mainMenu = {
    type: "list",
    message: "What would you like to do?",
    name: "mainMenu",
    choices: ["View All Employees","Add Employee","Update Employee Role","View All Roles","Add Role","View All Departments","Add Department","Quit"],
};

// Create inquirer question to input the name of dept when adding it
const deptPrompt = {
    type: "input",
    message: "Please enter the name of the new department: ",
    name: "deptName",
};
// Create inquirer questions to enter the name, salary, and department when a role is added
const rolePrompt = [{
    type: "input",
    message: "Please enter the role title: ",
    name: "roleTitle"
    },
    {
    type: "input",
    message: "Please enter the salary of the new role: ",
    name: "roleSalary"
    },
    {
    type: "input",
    message: "Please enter the department id the new role belongs in: ",
    name: "roleDept"
    }
];

// Create inquirer questions to enter employee's first name, last name, role, and manager when added

const employeePrompt = [{
    type: "input",
    message: "Please enter the employee's first name: ",
    name: "empFirstName"
    },
    {
    type: "input",
    message: "Please enter the employee's last name: ",
    name: "empLastName"
    },
    {
    type: "input",
    message: "Please enter the role id for the new employee's role: ",
    name: "empRole"
    },
    {
    type: "input",
    message: "Please enter the manager's employee id for the new employee's manager (leave blank if no manager): ",
    name: "empManager"
    }
];

// Create inquirer choice to select employee to update and allow their role to be updated
const updateEmployeePrompt = [{
    type: "list",
    message: "Please choose an employee to update their role",
    name: "employee",
    // allemployees will need to use an array of the employees to generate a list of choices
    choices: allEmployees
}];


// Create db query for departments to show department names and id
// const viewDepts = () => {
//     const sql = "SELECT * FROM department";

//     db.promise().query(sql, (err, result) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.table(result);
//     })
// };

const viewDepts = () => {
    const sql = "SELECT * FROM department";

    db.promise().query(sql)
    .then(([rows, fields]) => {
        console.table(rows);
    })
    .catch(console.log)
    .then( () => db.end());
};

viewDepts();
// Create db query for roles to show all roles, job title, role id, the department that role belongs to, and the salary for that role

// Create db query for employees to show all employees including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// Create db query for departments to add a department

// Create db query for role to add a role

// Create db query for employee to add an employee

// Create db query for employee to update an employee. Should this be in the same place as to add?