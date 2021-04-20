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
    
    idAndConcatName() {
        const queryString = `select concat(first_name," ",last_name) as "full_name",id
        from employees;`;
        return this.connection.query(queryString);
    }

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
    
    addEmployee(result,role_id,manager_id) {
        let queryString;
        if (!manager_id) {
            queryString = `insert into employees (first_name,last_name,role_id) values ("${result.first_name}","${result.last_name}",${role_id});`;
        } else {
            queryString = `insert into employees (first_name,last_name,role_id,manager_id) values ("${result.first_name}","${result.last_name}",${role_id},${manager_id});`;
        }
        return this.connection.query(queryString);
    };
    
    updateRole(id,role_id) {
        const queryString = `update employees set role_id = ${role_id} where id = ${id};`;
        return this.connection.query(queryString);
    };
    
    updateManager(id,manager_id) {
        const queryString = `update employees set manager_id = ${manager_id} where id = ${id};`;
        return this.connection.query(queryString);
    };
    
    getManagers() {
        const queryString = `select concat(c2.first_name," ",c2.last_name) Manager
        from employees c1
        inner join employees c2 on c1.manager_id = c2.id
        group by Manager;`;
        return this.connection.query(queryString);
    };
    
    getEmployeeByManager(result) {
        const queryString = `select concat(c2.first_name," ",c2.last_name) Manager, concat(c1.first_name," ",c1.last_name) Manages
        from employees c1
        inner join employees c2 on c1.manager_id = c2.id
        having Manager = "${result.manager}";`;
        return this.connection.query(queryString);
    };
    
    delete(table,id) {
        let queryString;
        switch(table) {
            case "department":
                queryString = `delete from departments where dept_id = ${id}`;
                break;

            case "role":
                queryString = `delete from roles where role_id = ${id}`;
                break;
                
            case "employee":
                queryString = `delete from employees where id = ${id}`;
                break;
                
            default:
                console.log("error");
                break;
        };
        return this.connection.query(queryString);
    };
    
    viewBudget(id) {
        const queryString = `select sum(case when d.dept_id = ${id} then salary else 0 end) budget
        from departments d
        inner join roles r on d.dept_id = r.dept_id
        inner join employees e on r.role_id = e.role_id;`;
        return this.connection.query(queryString);
    };
};

module.exports = DB;