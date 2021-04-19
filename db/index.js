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
        const queryString = `select c1.id, c1.first_name, c1.last_name, title, salary, concat(c2.first_name," ",c2.last_name) as "Manager",dept_name
        from employees c1
        left join roles on c1.role_id = roles.role_id
        left join employees c2 on c1.manager_id = c2.id
        left join departments on roles.dept_id = departments.dept_id;`;
        return this.connection.query(queryString);
    };
    
    allRoles() {
        const queryString = `select role_id,title,salary,dept_name
        from roles
        left join departments on roles.dept_id = departments.dept_id;`;
        return this.connection.query(queryString);
    };
    
    allDepts() {
        const queryString = `select * from departments;`;
        return this.connection.query(queryString);
    };

    addDept(result) {
        const queryString = `insert into departments (dept_name) values ("${result.newDept}");`;
        return this.connection.query(queryString);
    };
    
    getDeptIdByName(result) {
        const queryString = `select dept_id from departments where dept_name = "${result}";`;
        return this.connection.query(queryString);
    };

    addRole(result,id) {
        const queryString = `insert into roles (title,salary,dept_id) values ("${result.role}",${result.salary},${id});`;
        return this.connection.query(queryString);
    };

};

module.exports = DB;