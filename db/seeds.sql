insert into departments (dept_name) values ("RnD");
insert into departments (dept_name) values ("Admin");
insert into departments (dept_name) values ("Accounting");

insert into roles (title,salary,dept_id) values ("Senior researcher",200000,1);
insert into roles (title,salary,dept_id) values ("Junior researcher",80000,1);
insert into roles (title,salary,dept_id) values ("HR Head",150000,2);
insert into roles (title,salary,dept_id) values ("HR",50000,2);
insert into roles (title,salary,dept_id) values ("CFO",250000,3);
insert into roles (title,salary,dept_id) values ("Bookkeeper",40000,3);

insert into employees (first_name,last_name,role_id) values ("Alice","Collins",1);
insert into employees (first_name,last_name,role_id,manager_id) values ("Emily","Graham",2,1);
insert into employees (first_name,last_name,role_id) values ("Ivy","Kennedy",3);
insert into employees (first_name,last_name,role_id,manager_id) values ("Mona","Owens",4,3);
insert into employees (first_name,last_name,role_id) values ("Quin","Smith",5);
insert into employees (first_name,last_name,role_id,manager_id) values ("Uma","Wright",6,5);