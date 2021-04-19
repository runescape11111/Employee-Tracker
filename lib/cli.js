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
                type: "rawlist",
                message: "Welcome to the main menu, please proceed:",
                choices: ["Add a role","Add a department","View employees","View roles","View departments","Exit"]
            }
        ])
        .then(answer => {
            switch (answer.choice) {
                case "View employees":
                    return this.db.allEmployees()
                    .then(result => {
                        console.log(`Table of all employees`);
                        printTable(result);
                    })
                    .then(() => {return this.mainMenu()});

                    
                case "View roles":
                    return this.db.allRoles()
                    .then(result => {
                        console.log(`Table of all roles`);
                        printTable(result);
                    })
                    .then(() => {return this.mainMenu()});

                case "Add a role":
                    let roleInfo = {};
                    return this.db.allDepts()
                    .then((result) => {
                        const deptNameList = result.map(item => {return item.dept_name});
                        return inquirer.prompt([
                            {
                                name: "role",
                                type: "input",
                                message: "Enter the name of the new role:"
                            },
                            {
                                name: "dept",
                                type: "rawlist",
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
                        roleInfo.result = result;
                        return this.db.getDeptIdByName(result.dept);
                    })
                    .then(id => {return this.db.addRole(roleInfo.result, id[0].dept_id)})                    
                    .then(() => {return this.db.allRoles()})
                    .then(result => printTable(result))
                    .then(() => {return this.mainMenu()});
                    
                case "View departments":
                    return this.db.allDepts()
                    .then(result => {
                        console.log(`Table of all departments`);
                        printTable(result);
                    })
                    .then(() => {return this.mainMenu()});

                case "Add a department":
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

                default:
                    console.log("Until next time!");
                    return this.exit();
            };
        })
    };
};

module.exports = CLI;