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
    dept_id integer not null
);

create table employees(
    id integer auto_increment primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    full_name varchar(60) not null,
    role_id integer not null,
    manager_id integer,
    manager_name varchar(60)
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

insert into employees (first_name,last_name,full_name,role_id) values ("AB","CD","AB CD",1);
insert into employees (first_name,last_name,full_name,role_id,manager_id,manager_name) values ("EF","GH","EF GH",2,1,"AB CD");
insert into employees (first_name,last_name,full_name,role_id) values ("IJ","KL","IJ KL",3);
insert into employees (first_name,last_name,full_name,role_id,manager_id,manager_name) values ("MN","OP","MN OP",4,3,"IJ KL");
insert into employees (first_name,last_name,full_name,role_id) values ("QR","ST","QR ST",5);
insert into employees (first_name,last_name,full_name,role_id,manager_id,manager_name) values ("UV","WX","UV WX",6,5,"QR ST");

select * from employees;
select * from roles;
select * from departments;

select first_name,last_name,title,salary,manager_name,dept_name
from employees
left join roles on employees.role_id = roles.role_id
left join departments on roles.dept_id = departments.dept_id;