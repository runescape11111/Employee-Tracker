# Employee-Tracker
## ![badge](https://img.shields.io/static/v1?label=Licence&message=MIT&color=blue&style=plastic)
## Table of Contents
- [Description](#Description)
- [Installation Instructions](#Installation-Instructions)
- [Usage Information](#Usage-Information)
- [Contribution Guidelines](#Contribution-Guidelines)
- [Test Instructions](#Test-Instructions)
- [Video Link](#Video-Link)
- [GitHub Page](#GitHub-Page)
- [Questions](#Questions)
## Description
This is an employee tracker, a command line app to manage the list of employees, roles and departments, and make changes to them. 
## Installation Instructions
To install required npm packages:
```
npm i
```
To create the database:
```
mysql -u root -p < db/schema.sql
```
To pre-populate the database with some entries:
```
mysql -u root -p < db/seeds.sql
```
To start the app:
```
npm start
```
## Usage Information
Upon launch, the user will be sent to the main menu with all the options. The user can view lists and add new entries for departments, roles, and employees. Roles are assigned to existing departments, and employees to roles. Roles have a predetermined salary, and employees can have a dedicated manager. The total departmental budget, i.e. total salary, can be viewed in the option. It is also possible to view managers and the employees under them. Other functions include updating the role of current employees, as well as changing their manager.
## Contribution Guidelines
N/A
## Test Instructions
```
N/A
```
## Video Link
https://drive.google.com/file/d/1NdKNVh5KLF2_WcKPww5EwBhaziWGgfp_/view?usp=sharing
## GitHub Page
https://github.com/runescape11111/Employee-Tracker
## Questions
GitHub profile: github.com/runescape11111/

Email: olivershih@gmail.com
