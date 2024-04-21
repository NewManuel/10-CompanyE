
//Importing Dependencies - This script imports the necessary packages: inquirer for CLI interaction and mysql2 for connecting to the MySQL database.
const inquirer = require('inquirer');
const mysql = require('mysql2');
//Database Connection - the variable creates a connection to the MySQL database using the provided credentials (host, user, database).
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tracker_db'
})
//Menu Options - this variable defines a menu array containing options for viewing departments, roles, and employees, as well as adding new departments, roles, and employees, and updating employee roles.This menu is structured as an array of objects, each representing a menu item.
const menu = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", new inquirer.Separator(), "Add a department", "Add a role", "Add an employee", "Update an employee role", new inquirer.Separator(),]
    },
];
//Introduction Text - this vaariable defines an ASCII art intro text to display when the script starts.This is displayed using console.log.
const introText = [{
    type: 'text',
    name: 'intro',
    message: `
 _______  _______  _______  _______  _______  _                 _______
(  ____ \(  ___  )(       )(  ____ )(  ___  )( (    /||\     /|(  ____ \
| (    \/| (   ) || () () || (    )|| (   ) ||  \  ( |( \   / )| (    \/
| |      | |   | || || || || (____)|| (___) ||   \ | | \ (_) / | (__
| |      | |   | || |(_)| ||  _____)|  ___  || (\ \) |  \   /  |  __)
| |      | |   | || |   | || (      | (   ) || | \   |   ) (   | (
| (____/\| (___) || )   ( || )      | )   ( || )  \  |   | |   | (____/\
(_______/(_______)|/     \||/       |/     \||/    )_)   \_/   (_______/
    `,
}];

//Prompt Menu Function - below defines a function showMenu that uses inquirer to prompt the user with the menu options defined earlier.Based on the user's choice, it calls different functions to perform corresponding actions.
function showMenu() {
    inquirer
        .prompt(menu)
        .then((response) => {
            switch (response.menu) {
                case "View all departments":
                    cumaltiveDepartQue();
                    break;

                case "View all roles":
                    cumaltiveRolesQue();
                    break;
                case "View all employees":
                    cumaltiveEmployQue();
                    break;
                case "Add a department":
                    departQueAddition()
                    break;
                case "Add a role":
                    roleQuePlus()
                    break;
                case "Add an employee":
                    employeeQuePlus()
                    break;
                case "Update an employee role":
                    employeeQueRefsh()
                    break;
            }
        });
}

//Database Query Functions - below defines functions to execute various SQL queries against the database:
// These functions use SQL queries to interact with the database and console.log to display the results or error messages.

//roleQuePlus - this function adds a new role to the database based on user input.
function roleQuePlus() {
    const departmentOptionsSql = 'SELECT name FROM department';
    connection.query(departmentOptionsSql, (error, departmentResults) => {
        if (error) {
            console.log("Error loading department options: ", error);
            showMenu();
        } else {
            const departmentChoices = departmentResults.map((department) => department.name);
            inquirer
                .prompt([
                    {
                        name: "role_title",
                        type: "input",
                        message: "Role title?",
                    },
                    {
                        name: "role_salary",
                        type: "number",
                        message: "Role salary?",
                    },
                    {
                        name: "role_department",
                        type: "list",
                        message: "Select Department:",
                        choices: departmentChoices,
                    },
                ])
                .then((response) => {
                    const insertRoleSql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
                    const selectDepartmentIdSql = 'SELECT id FROM department WHERE name = ?';
                    connection.query(selectDepartmentIdSql, [response.role_department], (error, departmentResults) => {
                        if (error) {
                            console.log("Error retieving department ID:", error);
                            showMenu();
                        } else {
                            const departmentId = departmentResults[0] ? departmentResults[0].id : null;

                            if (departmentId !== null) {
                                connection.query(insertRoleSql, [response.role_title, response.role_salary, departmentId], (error, results) => {
                                    if (error) {
                                        console.log("Error inserting into db: ", error);
                                    } else {
                                        console.log("Added role: ", response.role_title);
                                    }
                                    showMenu();
                                })
                            } else {
                                console.log("Department not found. Role not added.");
                                showMenu();
                            }
                        }
                    });
                });
        }
    })

};


//employeeQuePlus- this function Adds a new employee to the database based on user input.
function employeeQuePlus() {
    const roleOptionsSql = "SELECT title FROM role";
    connection.query(roleOptionsSql, (error, roleResults) => {
        if (error) {
            console.log("Error retreiving roles: ", error);
            showMenu();
        } else {
            const roleChoices = roleResults.map((role) => role.title);
            const managerOptionsSql = 'SELECT CONCAT(first_name, " ", last_name) AS manager_name FROM employee';

            connection.query(managerOptionsSql, (error, managerResults) => {
                if (error) {
                    console.log("Error retreiving manager options: ", error);
                    showMenu();
                } else {
                    const managerChoices = managerResults.map((manager) => manager.manager_name);
                    managerChoices.push('null');
                    inquirer
                        .prompt([
                            {
                                name: "employee_firstName",
                                type: "input",
                                message: "Employee first name?",
                            },
                            {
                                name: "employee_lastName",
                                type: "input",
                                message: "Employee last name?",
                            },
                            {
                                name: "employee_role",
                                type: "list",
                                message: "Select role: ",
                                choices: roleChoices
                            },
                            {
                                name: "employee_manager",
                                type: "list",
                                message: "Select Manager: ",
                                choices: managerChoices,
                            },
                        ])
                        .then((response) => {            
                            const insertEmployeeSql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                            selectRoleIdSql = "SELECT id FROM role WHERE title = ?"; 
                            connection.query(selectRoleIdSql, [response.employee_role], (error, roleResults) => {
                                if (error) {
                                    console.log("Error retieving role ID:", error);
                                    showMenu();
                                } else {                                   
                                    const roleId = roleResults[0] ? roleResults[0].id : null;
                                    if (roleId !== null) {
                                        if (response.employee_manager !== 'null') {
                                            selectManagerIdSql = 'SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?';
                                            connection.query(selectManagerIdSql, [response.employee_manager], (error, managerResults) => {
                                                if (error) {
                                                    console.log("Error retrieving manager ID: ", error);
                                                    showMenu();
                                                } else {
                                                    const managerId = managerResults[0] ? managerResults[0].id : null;

                                                    if (managerId !== null) {
                                                        connection.query(
                                                            insertEmployeeSql, [response.employee_firstName, response.employee_lastName, roleId, managerId], (error, results) => {
                                                                if (error) {
                                                                    console.log("Error inserting into db: ", error);
                                                                } else {
                                                                    console.log("Added employee: ", response.employee_firstName, response.employee_lastName);
                                                                }
                                                                showMenu();
                                                            }
                                                        );
                                                    } else {
                                                        console.log("Manager not found. Employee not added.");
                                                        showMenu();
                                                    }
                                                }
                                            });
                                        } else {
                                            connection.query(insertEmployeeSql, [response.employee_firstName, response.employee_lastName, roleId, null], (error, results) => {
                                                if (error) {
                                                    console.log("Error inserting into db: ", error);
                                                } else {
                                                    console.log("Added employee:", response.employee_firstName, response.employee_lastName);
                                                }

                                                showMenu();
                                            })
                                        }
                                    } else {
                                        console.log("Role not found. Employee not added.");
                                        showMenu();
                                    }
                                }
                            });

                        });
                }
            })

        }
    })
};

//employeeQueRefsh - this function updates an employee's role based on user input.
function employeeQueRefsh() {
    const employeeListSql = "SELECT CONCAT(first_name, ' ', last_name) AS employee_name FROM employee";
    connection.query(employeeListSql, (error, employeeList) => {
        if (error) {
            console.log("Error retreiving employee list: ", error);
            showMenu();
        } else {
            const employeeChoices = employeeList.map((employee) => employee.employee_name); 
            const roleOptionsSql = 'SELECT title FROM role';

            connection.query(roleOptionsSql, (error, roleResults) => {
                if (error) {
                    console.log("Error loading role options: ", error);
                    showMenu();
                } else {
                    const roleChoices = roleResults.map((role) => role.title);
                    inquirer
                        .prompt([
                            {
                                name: "employee",
                                type: "list",
                                message: "Select the employee to update: ",
                                choices: employeeChoices,
                            },
                            {
                                name: "new_role",
                                type: "list",
                                message: "Select a new role: ",
                                choices: roleChoices,
                            }
                        ])
                        .then((response) => {
                            const updateEmployeeRoleSql = "UPDATE employee SET role_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?";

                            const roleIdSql = "SELECT id FROM role WHERE title = ?";

                            connection.query(roleIdSql, [response.new_role], (error, roleIdResults) => {
                                if (error) {
                                    console.log("Error retreiving role ID: ", error);
                                    showMenu();
                                } else {
                                    const roleId = roleIdResults[0] ? roleIdResults[0].id : null;
                                    connection.query(updateEmployeeRoleSql, [roleId, response.employee], (error, results) => {
                                        if (error) {
                                            console.log("Error updating employee role: ", error);
                                        } else {
                                            console.log("Updated employee role for:", response.employee);
                                        }
                                        showMenu();
                                    }
                                    );
                                }
                            });
                        });
                }
            })
        }
    })
};


//departQueAddition - this function adds a new department to the database based on user input.
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
                    console.log("Added department: ", response.department_name);
                }
                showMenu();
            })
        })
}

//cumaltiveDepartQue - this function retrieves and displays all departments from the database.
function cumaltiveDepartQue() {
    connection.query('SELECT id AS Department_ID, name AS Department_Name FROM department;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Departments:");
            console.table(results)
        }
    showMenu();
    })
};

//cumaltiveRolesQue - this function retrieves and displays all roles from the database.
function cumaltiveRolesQue() {
    connection.query('SELECT role.title AS Role_Title, role.id AS Role_ID, department.name AS Department_Name, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Roles:")
            console.table(results);
        }
        showMenu();
    })
};

//cumaltiveEmployQue - this function retrieves and displays all employees from the database.
function cumaltiveEmployQue() {
    connection.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department_Name, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Employees:")
            console.table(results);
        }
        showMenu();
    })
};



//Initialization Function - below defines an init function that displays the intro text, prompts the user with the menu, and starts the interaction loop.
function init() {
    inquirer
        .prompt(introText)
        .then();
    showMenu();
};

// Script Execution - It calls the init function to start the script.
init();