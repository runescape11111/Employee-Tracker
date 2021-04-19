drop database if exists company_db;
create database company_db;
use company_db;

create table departments(
    dept_id integer auto_increment primary key,
    dept_name varchar(30) not null
);

create table roles(
    role_id integer auto_increment primary key,
    title varchar(30) not null,
    salary decimal not null,
    dept_id integer not null,
    foreign key (dept_id) references departments(dept_id)
);

create table employees(
    id integer auto_increment primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer not null,
    manager_id integer,
    foreign key (role_id) references roles(role_id),
    foreign key (manager_id) references employees(id)
);

insert into departments (dept_name) values ("RnD");
insert into departments (dept_name) values ("Admin");
insert into departments (dept_name) values ("Accounting");

insert into roles (title,salary,dept_id) values ("Senior researcher",200000,1);
insert into roles (title,salary,dept_id) values ("Junior researcher",80000,1);
insert into roles (title,salary,dept_id) values ("HR Head",150000,2);
insert into roles (title,salary,dept_id) values ("HR",50000,2);
insert into roles (title,salary,dept_id) values ("CFO",250000,3);
insert into roles (title,salary,dept_id) values ("Bookkeeper",40000,3);

insert into employees (first_name,last_name,role_id) values ("AB","CD",1);
insert into employees (first_name,last_name,role_id,manager_id) values ("EF","GH",2,1);
insert into employees (first_name,last_name,role_id) values ("IJ","KL",3);
insert into employees (first_name,last_name,role_id,manager_id) values ("MN","OP",4,3);
insert into employees (first_name,last_name,role_id) values ("QR","ST",5);
insert into employees (first_name,last_name,role_id,manager_id) values ("UV","WX",6,5);

select * from employees;
select * from roles;
select * from departments;

-- select c1.id, c1.first_name, c1.last_name, title, salary, concat(c2.first_name," ",c2.last_name) as "Manager",dept_name
-- from employees c1
-- left join roles on c1.role_id = roles.role_id
-- left join employees c2 on c1.manager_id = c2.id
-- left join departments on roles.dept_id = departments.dept_id;

-- select first_name,last_name,title,salary,manager_name,dept_name
-- from employees
-- left join roles on employees.role_id = roles.role_id
-- left join departments on roles.dept_id = departments.dept_id;

-- select role_id,title,salary,dept_name
-- from roles
-- left join departments on roles.dept_id = departments.dept_id;