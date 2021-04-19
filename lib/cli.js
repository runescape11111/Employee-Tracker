const inquirer = require("inquirer");
const {printTable} = require("console-table-printer");

class CLI {
    constructor(db) {
        this.db = db;
    };

    start() {
        this.db.init()
        .then(() => this.mainMenu());
    };

    exit() {
        this.db.close_connection(() => process.exit(0));
    };

    mainMenu() {
        return inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "Welcome to the main menu, please proceed:",
                choices: ["Add an employee","Add a role","Add a department","View employees","View roles","View departments","Exit"]
            }
        ])
        .then(answer => {
            switch (answer.choice) {
                case "View employees":
                    return this.viewAllEmployees();

                case "Add an employee":
                    return this.addNewEmployee();
                
                case "View roles":
                    return this.viewAllRoles();

                case "Add a role":
                    return this.addNewRole();
                    
                case "View departments":
                    return this.viewAllDepartments();

                case "Add a department":
                    return this.addNewDepartment();

                default:
                    console.log("Until next time!");
                    return this.exit();
            };
        })
    };

    viewAllEmployees() {
        return this.db.allEmployees()
        .then(result => {
            console.log(`Table of all employees`);
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    addNewEmployee() {
        let employeeInfo = {};
        return this.db.allRoles()
        .then(result => {
            employeeInfo.roleList = result;
            return this.db.idAndConcatName();
        })
        .then(result => {
            employeeInfo.nameList = result;
            const roleList = employeeInfo.roleList.map(item => {return item.title});
            const nameConcat = result.map(item => {return item.full_name});
            nameConcat.push("None");
            return inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "Enter employee's first name:"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Enter employee's last name:"
                },
                {
                    name: "role",
                    type: "list",
                    message: "Choose employee's role:",
                    choices: roleList
                },
                {
                    name: "manager",
                    type: "rawlist",
                    message: "Choose employee's manager:",
                    choices: nameConcat
                }
            ])
            .then(result => {
                console.log(`Added new employee successfully!`);
                let role_id;
                employeeInfo.roleList.forEach(item => {
                    if(result.role === item.title) {
                        role_id = item.role_id;
                    };
                });
                let manager_id;
                employeeInfo.nameList.forEach(item => {
                    if(result.manager === item.full_name) {
                        manager_id = item.id;
                    };
                });
                return this.db.addEmployee(result,role_id,manager_id);
            })
            .then(() => {return this.db.allEmployees()})
            .then(result => printTable(result))
            .then(() => {return this.mainMenu()});
        });
    };

    viewAllRoles() {
        return this.db.allRoles()
        .then(result => {
            console.log(`Table of all roles`);
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    addNewRole() {
        let roleInfo = {};
        return this.db.allDepts()
        .then((result) => {
            roleInfo.dept = result;
            const deptNameList = result.map(item => {return item.dept_name});
            return inquirer.prompt([
                {
                    name: "role",
                    type: "input",
                    message: "Enter the name of the new role:"
                },
                {
                    name: "dept",
                    type: "list",
                    message: "The new role is for this department:",
                    choices: deptNameList
                },
                {
                    name: "salary",
                    type: "input",
                    message: "Enter the salary of the new role:"
                }
            ]);
        })
        .then(result => {
            console.log(`Added new role successfully!`);
            let dept_id;
            roleInfo.dept.forEach(item => {
                if (result.dept === item.dept_name) {
                    dept_id = item.dept_id;
                }
            });
            return this.db.addRole(result,dept_id);
        })                   
        .then(() => {return this.db.allRoles()})
        .then(result => printTable(result))
        .then(() => {return this.mainMenu()});
    };

    viewAllDepartments() {
        return this.db.allDepts()
        .then(result => {
            console.log(`Table of all departments`);
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    addNewDepartment() {
        return inquirer.prompt([
            {
                name: "newDept",
                type: "input",
                message: "Enter the name of the new department:"
            }
        ])
        .then(result => {
            console.log(`Added new department successfully!`);
            return this.db.addDept(result);
        })
        .then(() => {return this.db.allDepts()})
        .then(result => printTable(result))
        .then(() => {return this.mainMenu()});
    };
};

module.exports = CLI;