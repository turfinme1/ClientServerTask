# Introduction

Frameworkless implementation of client-server architecture using Node.js.
Main functionalities include:

- Login and register functionality
- Client and server side input validation
- MySQL data storage for persisting user data
- Email sending for user email verification

## Install

1. Install the required dependencies by running: `npm install`.
2. Start the server by running: `node server.js`.
3. Access the server at: `http://localhost:${PORT}`.

## Project structure

Project is divided into 3 layers:

- data layer: Includes `userRepository.js`. Encapsulates all the logic ralated to data manipulation in the data store
- service layer: Includes `userService.js` and  `emailSenderService.js`. Acts as intermediary between data layer and router layer. Contains services related to authentication authorization, email sending
- router layer: Includes `userRoute.js` The router layer handles incoming requests from clients, routes them to the appropriate handlers, and sends back responses. It serves as the entry point for the application.

## Dependencies

- http: Node.js module for creating HTTP servers.
- path: Node.js module for working with file paths.
- fs: Node.js module for working with the file system.
- url: Node.js module for working with URLs.
- querystring: Node.js module for working with query strings.
- mysql2: A MySQL client for Node.js.
- mailtrap: Module providing email sending functionality
- uuid: Module for the creation of RFC4122 UUIDs

## Endpoints

- GET /\*: Serves the index.html file.
- POST /register: Handles user registration. Validates the input data and registers the user in the database.
- POST /login: Handles user login. Validates the input data and logs the user in.
- GET /confirm?validationToken=: Handles email verification. Verifies the user's email address based on the validation token.

## Unit tests
1. Start the unit tests: `npm run test`.
1. Create unit tests coverage: `npm test -- --coverage --collectCoverageFrom="./src/**"`.

Unit tests created with Jest. There is a generated report in coverage folder. Tested files include:
Unit tests have been created using Jest, and the tested files include` requestUtil.js`, `dataValidation.js`, `userRepository.js`, `userService.js`, `emailSenderService.js`, and `userRoute.js`. The coverage report for the unit tests can be found in the coverage folder.
