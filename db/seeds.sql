USE empTracker_db;

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
        ("Larry", "Legalman", 1, null),
        ("Sheila", "Servicelady", 1, null);