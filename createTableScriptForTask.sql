CREATE DATABASE `ClientServerTaskDb`;
USE `ClientServerTaskDb`;

CREATE TABLE `users`(
	user_id INT NOT NULL KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    isValidated BOOLEAN NOT NULL,
    token VARCHAR(255),
    validationToken VARCHAR(255)
);

INSERT INTO `clientservertaskdb`.`users`
(`user_id`,
`name`,
`username`,
`email`,
`password`,
`isValidated`)
VALUES
(1,
"alex",
"alexUserName",
"abv@abv.bg",
"12345678",
false);

INSERT INTO `clientservertaskdb`.`users` ( `name`,
`username`,
`email`,
`password`,
`isValidated`)
VALUES ( "alex",
"alexUserName",
"abv@abv.bg",
"12345678",
false);