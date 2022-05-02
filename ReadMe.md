# Employee-Tracker-CMS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents
<ol>
  <li><a href="#description">Description</a></li> 
<li><a href="#license">License</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#contributors">Contributors</a></li>
  <li><a href="#testing">Testing</a></li>
  <li><a href="#questions">Questions</a></li>

</ol>

## Description
This is a node.js app that allows a user to enter data to view, add, and update departments, roles within departments, and employees. The user can track employee roles, salaries, and managers, and they can also update the role of employees should they be promoted. All of the tables within the database are linked, so salaries update automatically when a new role is applied to an employee.

Note: This app has a dependency on console.table because using this was a requirement of this bootcamp assignment. However, it appears as though console.table is built into the current version of javascript, so this dependency could removed, and each of the view functions could replace the code that builds and console logs tables using consoleTable with a simple console.table.

[Click here to view a demo video of the app in action!](https://drive.google.com/file/d/1AfBtgzedKfcERgs6_8Mdsd11vI1nXcAW/view)
    
## License
**MIT** - A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. 

  [MIT License Information](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)
## Installation
Open the main folder in the terminal and type 'npm install' once. After you have done so, use the included schema with mysql2 to create a database and tables. If desired, you can seed the tables with data from seeds.sql, or you can simply use the app to create your own data for the tables. To use the app once the databases and tables are built, type node index.js in the terminal.

## Usage
Type node index.js in the terminal after completing the installation steps above.

## Contributors
I collaborated on parts of this app with [Danny Yates](https://github.com/cycoconutz/Portfolio).

I also got some ideas and syntax from a public github repo from github user [jtbataille](https://github.com/jtbataille/Employee-Tracker/blob/master/server.js).

## Testing
Try it out!

## Questions
Author: [Stiltskinner](https://github.com/Stiltskinner)

You can reach me with any questions at my email: [ryan.thomas@utexas.edu](mailto:ryan.thomas@utexas.edu)
