# Advanced Task Management System

This project is an advanced task management system developed using Angular 18. It aims to provide a comprehensive solution for task creation, assignment, tracking, and reporting, all on the frontend without requiring backend integration.

## Table of Contents
- [Advanced Task Management System](#advanced-task-management-system)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [Technical Requirements](#technical-requirements)
  - [Getting Started](#getting-started)
  - [Running the Application](#running-the-application)
  - [Fake Test Data](#fake-test-data)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Key Features
- **User Authentication and Authorization**: Simulated JWT-based authentication with role-based access control (RBAC).
- **Dashboard and Task Views**: Dynamic dashboard with task views in board, list, grid, and calendar formats.
- **State Management**: Used NgRx for state management accross all components.
- **Task Management**: CRUD operations for tasks, drag-and-drop functionality in board view.
- **Real-time Updates**: Simulated real-time updates using RxJS.
- **Task Collaboration**: Comments, file attachment, and mentions for team collaboration.
- **Advanced Search and Filtering**: Searching, filtering, sorting and downloading as CSV.
- **Reporting and Analytics**: Comprehensive insights on task performance and team efficiency.
- **Internationalization and Localization**: Support for multiple languages and locales.
- **Responsive Design**: Full responsiveness across devices for seamless user experience.

## Technical Requirements
- **Angular Version**: 18.1.1
- **State Management**: NgRx
- **UI/UX Framework**: Bootstrap & Angular Material's CDK
- **Testing**: Jasmine, Karma (unit testing), Protractor (end-to-end testing)
- **Charts**: Chart.js
- **Authentication**: angular-jwt
- **Reactive programming functionalities**: RxJS
- **Internationalization & Localization**: angular-localize

## Getting Started
To get a local copy up and running, follow these steps:

## Running the Application
1. Clone the repository:
   ```bash
   git clone [Advanced Task Management System](https://gitlab.com/geraldgnika/advanced-task-management-system)
   cd advanced-task-management-system
   npm install
   json-server --watch server.json & ng serve
   Navigate to: "http://localhost:4200/" in your browser.

## Fake Test Data
1. Use these credentials to test the system:
   ```bash
   1. Username: gerald_nika : Project Manager,
   2. Username: andi_nika : Team Lead,
   3. Username: gerardo_tatzati : Developer.

   Password: 123456 for all of them.

## Testing
1. To run tests, use the following commands:
    ```bash
    ng test
    npm run e2e

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT License. Copyright (c) Gerald Nika
