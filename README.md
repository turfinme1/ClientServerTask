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

# Server.js

This is the main server file for the ClientServerTask project. It handles HTTP requests and serves files based on the request URL.

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

- GET /*: Serves the index.html file.
- POST /register: Handles user registration. Validates the input data and registers the user in the database.
- POST /login: Handles user login. Validates the input data and logs the user in.
- GET /confirm?validationToken=: Handles email verification. Verifies the user's email address based on the validation token.
