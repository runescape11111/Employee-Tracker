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