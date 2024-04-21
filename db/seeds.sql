INSERT INTO
    department (id, name)
VALUES (1, "Cell"),
    (2, "Intelligence Appreatus"),
    (3, "Operations Chief"),
    (4, "Mission Impossible");

INSERT INTO
    role (
        id, title, salary, department_id
    )
VALUES (1, "Field Agent", 90000, 1),
    (2, "Double Agent", 80000, 1),
    (
        3, "Field Operator", 150000, 2
    ),
    (
        4, "Intel Operator", 1200000, 2
    ),
    (
        5, "Division Operator", 160000, 2
    ),
    (
        6, "Forensic Accountant", 1205000, 3
    ),
    (7, "Secret Agent", 2500000, 4),
    (8, "Assissin", 290000, 4);

INSERT INTO
    employee (
        first_name, last_name, role_id, manager_id
    )
VALUES ("Tame", "Doe", 1, null),
    ("Austin", "Powers", 2, 1),
    ("Jack", "Johnson", 3, null),
    ("John", "Doe", 4, 3),
    ("Brittany", "Spears", 5, null),
    ("Jesse", "Jackson", 6, 5),
    ("Jay-z", "Carter", 7, null),