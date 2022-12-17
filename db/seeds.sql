INSERT INTO department (name)
VALUES
    ("HR"),
    ("SALES"),
    ("ENGINEERING");

INSERT INTO role (title, salary, department_id)
VALUES
    ("HR REP", 50000.00, 1),
    ("SALES REP", 60000.00, 2),
    ("ENGINEER", 90000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Joe", "Smith", 1, null),
    ("Mary", "Jean", 2, 1),
    ("Julie", "Jacobs", 3, 1);
    