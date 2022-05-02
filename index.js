// require all packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create database connection

const db = mysql.createConnection(
    {
        host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'VerySecure8',
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

// Starts the app and displays a title card in the terminal
const init = () => {
    console.log("************************************************")
    console.log("*                                              *")
    console.log("*               EMPLOYEE MANAGER               *")
    console.log("*                                              *")
    console.log("************************************************")
    openMenu()
};

// Function to Open the Menu of inquirer prompts with all of the options a user can choose from when using the app
const openMenu = () => {
    inquirer
    .prompt(mainMenu)
    .then((response) => {
        switch (response.mainMenu) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployeeName();
                break;
            case 'Update Employee Role':
                updateEmp();
                break;
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
            case 'Quit':
                process.exit();
        }
    })
};

// Department functions to view and create departments
const viewDepts = () => {
    const sql = "SELECT * FROM department";

    db.promise().query(sql)
    .then(([rows, fields]) => {
        const table = consoleTable.getTable(rows);
        console.log(table);
    })
    .catch(console.log)
    .then( () => openMenu());
};

// Inquirer question to ask user to input the name of dept when adding a new dept
const deptPrompt = {
    type: "input",
    message: "Please enter the name of the new department: ",
    name: "deptName",
};

const addDept = () => {
    inquirer
    .prompt(deptPrompt)
    .then((response) => {
        genDept(response);
    })
};

// Function to take user input from addDept and insert the new department into the departments table
const genDept = (data) => {
    const {deptName} = data;
    const params = [deptName];
    const sql = `INSERT INTO department (name) VALUES (?)`;
    db.promise().query(sql, params)
    .then(`Added new department: ${deptName}`)
    .catch(console.log)
    .then( () => openMenu());
};

// Role functions to view and create roles. This joins the department table to display the department name rather than just the dept_id
const viewRoles = () => {
    const sql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.dept_id = department.id`;

    db.promise().query(sql)
    .then(([rows, fields]) => {
        const table = consoleTable.getTable(rows);
        console.log(table);
    })
    .catch(console.log)
    .then( () => openMenu());
};

// Function to ask for necessary info from user to create a new role, and then create a new entry in the role table with the user information
const addRole = () => {
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
                message: "What is the salary for this position?",
                name: "roleSalary",
            },
            {
                type: "list",
                message: "Please choose a department",
                // choices uses a function to get data from the department table so it can build a list of the department names for the user to pick from
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
            let dept_id; //This code compares the department name from the inquirer answer to the data from the departments database to convert the answer into a dept_id so that it can be used in a sql query
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

// functions to view and create employees

// view employees joins the employees table to itself in order to display the manager's name rathern than id, then joins the role table, which itself joins the departments table, all so the proper names are displayed rather than ids
const viewEmployees = () => {
    const sql = `SELECT a.id AS id, a.first_name AS first_name, a.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id JOIN role ON a.role_id = role.id JOIN department ON role.dept_id = department.id `;

    db.promise().query(sql)
    .then(([rows, fields]) => {
        const table = consoleTable.getTable(rows);
        console.log(table);
    })
    .catch(console.log)
    .then( () => openMenu());
};

// The first in a series of functions to create a new employee. This asks the user for the first and last name of the new employee, trims the response, and passes that info into the addEmployeeRole function
const addEmployeeName = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the employee's first name: ",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please enter the employee's last name: ",
            name: "lastName"
        }
    ]).then(answers => {
        addEmployeeRole(answers.firstName.trim(), answers.lastName.trim());
    });
}

// The next step in creating a new employee, it takes in names from the previous function, then it queries the role table and uses that information to build a list of choices for an inquirer prompt so it can ask the user which role the employee should have. It converts that inquirer answer into a role_id, and it passes firstname, lastname, and roleid on to the next function
const addEmployeeRole = (firstName, lastName) => {
    let sql = "SELECT * FROM role";
    db.query(sql, (err, response) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select the new employee's role: ",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < response.length; i++) {
                        choices.push(response[i].title);
                    }
                    return choices;
                },
                name: "empRole"
            },
        ]).then(answer => {
            let role_id;
            for (let i = 0; i< response.length; i++) {
                if (response[i].title === answer.empRole) {
                    role_id = response[i].id;
                }
            }
            addEmployeeManager(firstName, lastName, role_id);            
        })
    })
};

// The 3rd step in adding a new employee, it takes in the info from the previous 2 functions, does a sql query for info from the employee table, and uses that to build a list of inquirer prompts for the user to select a manager for this new employee. The user can also choose "None" if there is no manager for that employee. It then passes either null (for no manager) or the manager's id to the last function in the chain
const addEmployeeManager = (firstName, lastName, role_id) => {
    let sql = "SELECT id, first_name, last_name FROM employee";
    db.query(sql, (err, response) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select a manager for this employee",
                choices: () => {
                    const choices = ["None"];
                    for (let i = 0; i < response.length; i++) {
                        let currName = `${response[i].first_name} ${response[i].last_name}`;
                        choices.push(currName);
                    }
                    return choices;
                },
                name: "manager"
            }
        ]).then(answer => {
            if (answer.manager === "None") {
                addEmployee(firstName, lastName, role_id, null);
                return;
            }
            let manager_id;
            const managerName = answer.manager.split(" ");
            for (let i = 0; i <response.length; i++) {
                if (response[i].first_name === managerName[0] && response[i].last_name === managerName[1]) {
                    manager_id = response[i].id;
                }
            };
            addEmployee(firstName, lastName, role_id, manager_id);
        })
    })
}

// This is the function that takes in all of the info from the previous functions and uses it to complete a sql query that inserts the new employee into the table
const addEmployee = (firstName, lastName, role_id, manager_id) => {
    let sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, role_id, manager_id], (err, res) => {
        if (err) throw err;
        console.log(`New Employee ${firstName} ${lastName} added to database`);
        openMenu();
    })
};

// Functions to update an employee role
// First function in the chain, queries the employee table and uses that to build a list of employees for an inquirer prompt. Converts the name chosen into an employee id, and passes it to the next function
const updateEmp = () => {
    let sql = "SELECT id, first_name, last_name, role_id FROM employee";
    db.query(sql, (err, response) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select an employee whose role you wish to update",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < response.length; i++) {
                        let currName = `${response[i].first_name} ${response[i].last_name}`;
                        choices.push(currName);
                    }
                    return choices;
                },
                name: "employee"
            }
        ]).then(answer => {
            let id;
            const employeeName = answer.employee.split(" ");
            for (let i = 0; i <response.length; i++) {
                if (response[i].first_name === employeeName[0] && response[i].last_name === employeeName[1]) {
                    id = response[i].id;
                }
            };
            askEmpRole(id);
        })
    })
};

// Step 2 in updating an employee role. It takes in the employee id for the employee who needs their role updated, queries the role database, builds a list of roles for inquirer, and converts the inquirer answer into a role_id. Then it passes id and role_id on to the last function
const askEmpRole = (id) => {
    let sql = `SELECT role.id AS id, role.title AS title FROM role`;
    db.query(sql, (err, response) => {
        if (err) throw (err);
        inquirer.prompt([
            {
                type: "list",
                message: "Please select the employee's new role: ",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < response.length; i++) {
                        choices.push(response[i].title);
                    }
                    return choices;
                },
                name: "newRole"
            },
        ])
        .then(answer => {
            let role_id;
            for (let i = 0; i< response.length; i++) {
                if (response[i].title === answer.newRole) {
                    role_id = response[i].id;
                }
            }
            updateEmpRole(id, role_id);            
        })
    })
};

// Function that takes in id of employee to be updated and role id of their new role, then updates the role id to the new value.
const updateEmpRole = (id, role_id) => {
    let sql = `UPDATE employee SET role_id = ${role_id} WHERE id = ${id}`;
    db.query(sql, (err, response) => {
        if (err) throw (err);
        console.log(`Employee Role Updated`);
        openMenu();
    });
}

init();