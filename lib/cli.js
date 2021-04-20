const inquirer = require("inquirer");
const {printTable, Table} = require("console-table-printer");

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
                choices: ["Add an employee","Remove an employee","Add a role","Remove a role","Add a department","Remove a department","Update employee role","Update employee manager","View employees","View employees by manager","View roles","View departments","View department budget","Exit"]
            }
        ])
        .then(answer => {
            switch (answer.choice) {
                case "View department budget":
                    return this.viewDeptBudget();

                case "Remove an employee":
                    return this.removeEmployee();

                case "Remove a role":
                    return this.removeRole();

                case "Remove a department":
                    return this.removeDepartment();

                case "View employees by manager":
                    return this.viewByManager();

                case "Update employee manager":
                    return this.updateEmployeeManager();

                case "Update employee role":
                    return this.updateEmployeeRole();

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

    removeEmployee() {
        let info = {};
        return this.db.idAndConcatName()
        .then(result => {
            info.list = result;
            const nameList = result.map(item => {return item.full_name});
            return inquirer.prompt([
                {
                    name:"name",
                    type: "list",
                    message: "Choose employee to remove",
                    choices: nameList
                }
            ]);
        })
        .then(result => {
            info.target = result.name;
            let id;
            info.list.forEach(item => {
                if (item.full_name === info.target) {
                    id = item.id;
                };
            });
            return this.db.delete("employee",id);
        })
        .then(result => {
            console.log(`${info.target} successfully removed`);
            return this.db.allEmployees();
        })
        .then(result => {
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    removeRole() {
        let info = {};
        return this.db.allRoles()
        .then(result => {
            info.list = result;
            const nameList = result.map(item => {return item.title});
            return inquirer.prompt([
                {
                    name:"name",
                    type: "list",
                    message: "Choose role to remove",
                    choices: nameList
                }
            ]);
        })
        .then(result => {
            info.target = result.name;
            let id;
            info.list.forEach(item => {
                if (item.title === info.target) {
                    id = item.role_id;
                };
            });
            return this.db.delete("role",id);
        })
        .then(result => {
            console.log(`${info.target} successfully removed`);
            return this.db.allRoles();
        })
        .then(result => {
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    removeDepartment() {
        let info = {};
        return this.db.allDepts()
        .then(result => {
            info.list = result;
            const nameList = result.map(item => {return item.dept_name});
            return inquirer.prompt([
                {
                    name:"name",
                    type: "list",
                    message: "Choose department to remove",
                    choices: nameList
                }
            ]);
        })
        .then(result => {
            info.target = result.name;
            let id;
            info.list.forEach(item => {
                if (item.dept_name === info.target) {
                    id = item.dept_id;
                };
            });
            return this.db.delete("department",id);
        })
        .then(result => {
            console.log(`${info.target} successfully removed`);
            return this.db.allDepts();
        })
        .then(result => {
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    viewDeptBudget(){
        let info = {};
        return this.db.allDepts()
        .then(result => {
            info.list = result;
            const nameList = result.map(item => {return item.dept_name});
            return inquirer.prompt([
                {
                    name:"name",
                    type: "list",
                    message: "Choose department to view budget",
                    choices: nameList
                }
            ]);
        })
        .then(result => {
            info.target = result.name;
            let id;
            info.list.forEach(item => {
                if (item.dept_name === info.target) {
                    id = item.dept_id;
                };
            });
            return this.db.viewBudget(id);
        })
        .then(result => {
            console.log(`Budget for ${info.target}: ${result[0].budget}`);
            return this.mainMenu();
        });
    };

    viewByManager() {
        return this.db.getManagers()
        .then(result => {
            const managers  = result.map(item => {return item.Manager});
            return inquirer.prompt([
                {
                    name: "manager",
                    type: "list",
                    message: "Choose manager",
                    choices: managers
                }
            ]);
        })
        .then(result => {
            return this.db.getEmployeeByManager(result);
        })
        .then(result => {
            console.log(result);
            const p = new Table({
                columns: [
                    {
                        name: "managed",
                        aligntment: "right",
                        title: `Employees managed by ${result[0].Manager}`,
                    }
                ]
            });
            result.forEach(item => {
                p.addRow(
                    {
                        managed: item.Manages,
                    }
                );
            });
            p.printTable();
            // printTable(result.map(item => {return item.Manages}));
        })
        .then(() => {return this.mainMenu()});
    };

    updateEmployeeManager() {
        let info = {};
        return this.db.allEmployees()
        .then(result => {
            result.forEach(item => {
                item.full_name = `${item.first_name} ${item.last_name}`;
            });
            info.employees = result;
            info.names = info.employees.map(item => {return item.full_name});
            return inquirer.prompt([
                {
                    name: "name",
                    type: "list",
                    message: "Choose employee to be updated",
                    choices: info.names
                }
            ]);
        })
        .then(result => {
            info.target = result.name;
            info.managers = info.names.filter(item => item !== result.name);
            info.managers.push("None");
            return inquirer.prompt([
                {
                    name: "manager",
                    type: "list",
                    message: "Choose manager",
                    choices: info.managers
                }
            ]);
        })
        .then(result => {
            let id;
            let manager_id;
            info.employees.forEach(item => {
                if (item.full_name === info.target) {
                    id = item.id;
                };
            });
            if (result.manager === "None") {
                manager_id = null;
            } else {
                info.employees.forEach(item => {
                    if (item.full_name === result.manager) {
                        manager_id = item.id;
                    };
                });
            };
            return this.db.updateManager(id,manager_id);
        })
        .then(result => {
            console.log("Role update successfull!");
            return this.db.allEmployees();
        })
        .then(result => {
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
    };

    updateEmployeeRole() {
        let info = {};
        return this.db.allEmployees()
        .then(result => {
            result.forEach(item => {
                item.full_name = `${item.first_name} ${item.last_name}`;
            });
            info.employees = result;
            return this.db.allRoles();
        })
        .then(result => {
            info.roles = result;
            const nameList = info.employees.map(item => {return item.full_name});
            const roleList = info.roles.map(item => {return item.title});
            return inquirer.prompt ([
                {
                    name: "name",
                    type: "list",
                    message: "Choose employee to be updated",
                    choices: nameList
                },
                {
                    name: "role",
                    type: "list",
                    message: "Choose new employee role",
                    choices: roleList
                }
            ]);
        })
        .then(result => {
            let id;
            let role_id;
            info.employees.forEach(item => {
                if (item.full_name === result.name) {
                    id = item.id;
                };
            });
            info.roles.forEach(item => {
                if (item.title === result.role) {
                    role_id = item.role_id;
                };
            });
            return this.db.updateRole(id,role_id);
        })
        .then(result => {
            console.log("Role update successfull!");
            return this.db.allEmployees();
        })
        .then(result => {
            printTable(result);
        })
        .then(() => {return this.mainMenu()});
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
        let info = {};
        return this.db.allRoles()
        .then(result => {
            info.roleList = result;
            return this.db.idAndConcatName();
        })
        .then(result => {
            info.nameList = result;
            const roleList = info.roleList.map(item => {return item.title});
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
                    type: "list",
                    message: "Choose employee's manager:",
                    choices: nameConcat
                }
            ])
            .then(result => {
                console.log(`Added new employee successfully!`);
                let role_id;
                info.roleList.forEach(item => {
                    if(result.role === item.title) {
                        role_id = item.role_id;
                    };
                });
                let manager_id;
                info.nameList.forEach(item => {
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
        let info = {};
        return this.db.allDepts()
        .then((result) => {
            info.dept = result;
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
            info.dept.forEach(item => {
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