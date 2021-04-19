const util = require("util");
const defaultConnection = require("./connection");

class DB {
    constructor() {
        this.connection = defaultConnection;
    };

    init() {
        return new Promise((resolve, reject) => {
            this.connection.connect((error) => {
                if (error) {
                    return reject(error);
                };
                this.connection.query = util.promisify(this.connection.query);
                resolve();
            });
        });
    };

    close_connection(callback) {
        return this.connection.end(callback);
    };

    allEmployees() {
        const queryString = `select first_name,last_name,title,salary,manager_name,dept_name
        from employees
        left join roles on employees.role_id = roles.role_id
        left join departments on roles.dept_id = departments.dept_id;`;
        return this.connection.query(queryString);
    };

};

module.exports = DB;