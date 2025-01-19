# CRUD Application

This repository contains a basic **CRUD (Create, Read, Update, Delete)** application built using **Node.js**, **Express**, and **MongoDB**. The application provides an API to manage data with features like pagination, filtering, and error handling.

---

## Features

- Create, Read, Update, and Delete operations for user data.
- Pagination for large datasets.
- Filtering using query parameters.
- Modular and scalable codebase.
- MongoDB as the database with aggregation pipelines for complex queries.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Example Requests](#example-requests)
- [License](#license)

---

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **Nodemon**: Utility to automatically restart the server during development.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/crud-application.git
   cd crud-application
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up MongoDB**:
   - Ensure MongoDB is running locally or use a cloud database like MongoDB Atlas.

4. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=3000
   DB_URI=mongodb://localhost:27017/crud-app
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```

---

## Environment Variables

| Variable  | Description                                      | Default Value         |
|-----------|--------------------------------------------------|-----------------------|
| `PORT`    | Port number for the server to run               | `3000`               |
| `DB_URI`  | MongoDB connection URI                         | `mongodb://localhost:27017/crud-app` |

---

## API Endpoints

### **User Endpoints**

#### **1. Get All Users (with Pagination)**
```http
GET /api/users?page={page}&limit={limit}
```
- **Description**: Fetch a list of users with optional pagination.
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of records per page (default: 10).

#### **2. Create a User**
```http
POST /api/users
```
- **Description**: Create a new user.
- **Request Body**:
  ```json
  {
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890"
  }
  ```

#### **3. Update a User**
```http
PUT /api/users/:id
```
- **Description**: Update an existing user by ID.
- **Request Body**:
  ```json
  {
      "name": "John Doe",
      "email": "john.new@example.com",
      "mobile": "0987654321"
  }
  ```

#### **4. Delete a User**
```http
DELETE /api/users/:id
```
- **Description**: Delete a user by ID.

---

## Usage

1. Start the application:
   ```bash
   npm start
   ```

2. Access the API at `http://localhost:3000`.

3. Use tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to test the endpoints.

---

## Example Requests

### Fetch All Users
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=5" -H "Content-Type: application/json"
```

### Create a User
```bash
curl -X POST "http://localhost:3000/api/users" -H "Content-Type: application/json" -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "mobile": "9876543210"
}'
```

### Update a User
```bash
curl -X PUT "http://localhost:3000/api/users/123" -H "Content-Type: application/json" -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "mobile": "9876543210"
}'
```

### Delete a User
```bash
curl -X DELETE "http://localhost:3000/api/users/123" -H "Content-Type: application/json"
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
