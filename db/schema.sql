DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT, name VARCHAR(30) NOT NULL, PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT, title VARCHAR(30), salary DECIMAL, department_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT NOT NULL, manager_id INT, FOREIGN KEY (role_id) REFERENCES role (id), FOREIGN KEY (manager_id) REFERENCES employee (id)
);