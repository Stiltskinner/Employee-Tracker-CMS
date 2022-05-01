USE empTracker_db;

DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;


INSERT INTO department (name)
VALUES ("Sales"),
       ("Legal"),
       ("Service");

INSERT INTO role (title, salary, dept_id)
VALUES  ("Sales Representative", 60000, 1),
        ("Lawyer", 100000, 2),
        ("Service Rep", 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Sam", "Salesperson", 1, null),
        ("Larry", "Legalman", 2, null),
        ("Sheila", "Servicelady", 3, null);