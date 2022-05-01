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

const db = mysql.createConnection(
    {
        host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Killfascists?',
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
    name: "empManager",
    default: null
    }
];

// Create inquirer choice to select employee to update and allow their role to be updated
const updateEmployeePrompt = [{
    type: "list",
    message: "Please choose an employee to update their role",
    name: "employee",
    // allemployees will need to use an array of the employees to generate a list of choices
    // choices: allEmployees
}];


const openMenu = () => {
    inquirer
    .prompt(mainMenu)
    .then((response) => {
        switch (response.mainMenu) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            // case 'Update Employee Role':
            //     updateEmp();
            //     break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewDepts();
                break;
            case 'Add Department':
                addDept();
                break;
        }
    })
};

// Department functions to view and create departments
const viewDepts = () => {
    const sql = "SELECT * FROM department";

    db.promise().query(sql)
    .then(([rows, fields]) => {
        console.table(rows);
    })
    .catch(console.log)
    .then( () => openMenu());
};

const addDept = () => {
    inquirer
    .prompt(deptPrompt)
    .then((response) => {
        genDept(response);
    })
};

const genDept = (data) => {
    const {deptName} = data;
    const params = [deptName];
    const sql = `INSERT INTO department (name) VALUES (?)`;
    db.promise().query(sql, params)
    .then(`Added new department: ${deptName}`)
    .catch(console.log)
    .then( () => openMenu());
};

// Role functions to view and create roles.
const viewRoles = () => {
    const sql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.dept_id = department.id`;

    db.promise().query(sql)
    .then(([rows, fields]) => {
        console.table(rows);
    })
    .catch(console.log)
    .then( () => openMenu());
};

function addRole() {
    let sql = "SELECT * FROM department";
    db.query(sql, (err, result) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the title of this role?",
                name: "roleTitle",
            },
            {
                type: "number",
                message: "What is the salary for this position? (Please enter two decimal places)",
                name: "roleSalary",
            },
            {
                type: "list",
                message: "Please choose a department",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < result.length; i++) {
                        choices.push(result[i].name);
                    }
                    return choices;
                },
                name: "department"
            }
        ]).then(answer => {
            let dept_id;
            for (let i = 0; i < result.length; i++) {
                if (result[i].name === answer.department) {
                    dept_id = result[i].id;
                }
            }
            sql = "INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)";
            db.query(sql, [answer.roleTitle, answer.roleSalary, dept_id], (err, res) => {
                if (err) throw err;

                openMenu();
            });
        });
    });
};

const genRole = (data) => {
    const {roleTitle, roleSalary, roleDept} = data;
    // for loop to check database for department name based on dept id
    const params = [roleTitle, roleSalary, roleDept];
    const sql = `INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)`;
    db.promise().query(sql, params)
    .then(`Added new role`)
    .catch(console.log)
    .then( () => openMenu());
};

const viewEmployees = () => {
    const sql = "SELECT * FROM employee";

    db.promise().query(sql)
    .then(([rows, fields]) => {
        console.table(rows);
    })
    .catch(console.log)
    .then( () => openMenu());
};

const addEmployee = () => {
    inquirer
    .prompt(employeePrompt)
    .then((response) => {
        genEmployee(response);
    })
};

const genEmployee = (data) => {
    let {empFirstName, empLastName, empRole, empManager} = data;
    const params = [empFirstName, empLastName, empRole, empManager];
    if (empManager === '') {
        empManager = null;
    }
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    db.promise().query(sql, params)
    .then(`Added new employee`)
    .catch(console.log)
    .then( () => openMenu());
};

openMenu();
// Create db query for roles to show all roles, job title, role id, the department that role belongs to, and the salary for that role

// Create db query for employees to show all employees including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// Create db query for departments to add a department

// Create db query for role to add a role

// Create db query for employee to add an employee

// Create db query for employee to update an employee. Should this be in the same place as to add?