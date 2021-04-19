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
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "Welcome to the main menu, please proceed:",
                choices: ["View all employees","Exit"]
            }
        ])
        .then(answer => {
            switch (answer.choice) {
                case "View all employees":
                    this.db.allEmployees()
                    .then(result => printTable(result))
                    .then(() => this.mainMenu());
                default:
                    console.log("Until next time!");
                    this.exit();
            }
        })
    }
};

module.exports = CLI;