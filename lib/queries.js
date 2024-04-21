//Importing Dependencies - The script imports the inquirer and mysql2 packages.
const inquirer = require('inquirer');
const mysql = require('mysql2');
//Database Connection: It creates a connection to the MySQL database using the provided credentials (host, user, database).
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tracker_db'
});
//Importing Prompt Menu Function - It imports the promptMenu function from another file named "index.js".This function seems to handle the main menu for the CLI interface.
const promptMenu = require("./index.js");

//Database Query Functions


//cumaltiveDepartQue - Retrieves all departments from the department table in the database and displays them in a table format.After displaying, it calls the promptMenu function.
function cumaltiveDepartQue() {
    connection.query('SELECT id AS Department_ID, name AS Department_Name FROM department;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Departments:");
            console.table(results)
        }

        promptMenu.promptMenu();
    })
};

// cumaltiveRolesQue - Retrieves all roles from the role table in the database, including related department information, and displays them in a table format.After displaying, it calls the promptMenu function.
function cumaltiveRolesQue() {
    connection.query('SELECT role.title AS Role_Title, role.id AS Role_ID, department.name AS Department_Name, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Roles:")
            console.table(results);
        }

        prompt.promptMenu();
    })
};

//cumaltiveEmployQue - Retrieves all employees from the employee table in the database, including related role and department information, and displays them in a table format.After displaying, it calls the promptMenu function.
function cumaltiveEmployQue() {
    connection.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department_Name, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Employees:")
            console.table(results);
        }

        prompt.promptMenu();
    })
};

//departQueAddition - Prompts the user to enter a department name and then inserts it into the department table in the database.After inserting, it calls the promptMenu function.
function departQueAddition() {
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "Department name?",
            },
        ])
        .then((response) => {
            const insertDepartmentSql = 'INSERT INTO department (name) VALUES (?)';
            connection.query(insertDepartmentSql, [response.department_name], (error, results) => {
                if (error) {
                    console.log("Error inserting into db: ", error);
                } else {
                    console.log("Added", response.department_name);
                }
                prompt.promptMenu();
            })
        })
};

// Exporting Functions - It exports the database query functions(cumaltiveDepartQue, cumaltiveRolesQue, cumaltiveEmployQue, departQueAddition) to be used in other parts of the application.
module.exports = {
    cumaltiveDepartQue,
    cumaltiveRolesQue,
    cumaltiveEmployQue,
    departQueAddition,
};









