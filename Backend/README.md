# API Documentation

## Endpoint: POST /users/register

### Description

This endpoint is used to register a new user in the system. It validates the input data, hashes the password, and creates a new user in the database. Upon successful registration, it returns a JSON Web Token (JWT) and the user details.

### Request Body

The request body should be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min: 3 characters, required)",
    "lastname": "string (min: 3 characters, optional)"
  },
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

### Response

#### Success Response

- **Status Code:** 201 Created
- **Body:**

```json
{
  "token": "string (JWT token)",
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  }
}
```

#### Error Responses

- **Status Code:** 400 Bad Request

  - **Description:** Validation errors in the input data.
  - **Body:**

  ```json
  {
    "errors": [
      {
        "msg": "string (error message)",
        "param": "string (field name)",
        "location": "string (body)"
      }
    ]
  }
  ```

- **Status Code:** 500 Internal Server Error
  - **Description:** An unexpected error occurred on the server.

### Example Request

```bash
curl -X POST \
  http://localhost:3000/users/register \
  -H 'Content-Type: application/json' \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Example Response

#### Success

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "645a1b2c3d4e5f6789012345",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Endpoint: POST /users/login

### Description

This endpoint is used to authenticate a user. It validates the input data, checks the credentials, and returns a JSON Web Token (JWT) along with the user details upon successful authentication.

### Request Body

The request body should be a JSON object with the following structure:

```json
{
  "email": "string (valid email format, required)",
  "password": "string (min: 6 characters, required)"
}
```

### Response

#### Success Response

- **Status Code:** 200 OK
- **Body:**

```json
{
  "token": "string (JWT token)",
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  }
}
```

#### Error Responses

- **Status Code:** 400 Bad Request

  - **Description:** Validation errors in the input data.
  - **Body:**

  ```json
  {
    "errors": [
      {
        "msg": "string (error message)",
        "param": "string (field name)",
        "location": "string (body)"
      }
    ]
  }
  ```

- **Status Code:** 401 Unauthorized

  - **Description:** Invalid email or password.
  - **Body:**

  ```json
  {
    "message": "Invalid email or password"
  }
  ```

- **Status Code:** 500 Internal Server Error
  - **Description:** An unexpected error occurred on the server.

### Example Request

```bash
curl -X POST \
  http://localhost:3000/users/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Example Response

#### Success

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "645a1b2c3d4e5f6789012345",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### Error

```json
{
  "message": "Invalid email or password"
}
```

## Endpoint: GET /users/profile

### Description

This endpoint is used to retrieve the profile information of the authenticated user. The user must be logged in and provide a valid token to access this endpoint.

### Request Headers

The request must include the following header:

```json
{
  "Authorization": "Bearer <JWT token>"
}
```

### Response

#### Success Response

- **Status Code:** 200 OK
- **Body:**

```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string"
}
```

#### Error Responses

- **Status Code:** 401 Unauthorized

  - **Description:** Missing or invalid token.
  - **Body:**

  ```json
  {
    "message": "Authentication failed"
  }
  ```

- **Status Code:** 500 Internal Server Error
  - **Description:** An unexpected error occurred on the server.

### Example Request

```bash
curl -X GET \
  http://localhost:3000/users/profile \
  -H 'Authorization: Bearer <JWT token>'
```

### Example Response

#### Success

```json
{
  "_id": "645a1b2c3d4e5f6789012345",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

#### Error

```json
{
  "message": "Authentication failed"
}
```

## Endpoint: GET /users/logout

### Description

This endpoint is used to log out the authenticated user. It clears the authentication token from the client and blacklists the token on the server to prevent further use.

### Request Headers

The request must include the following header:

```json
{
  "Authorization": "Bearer <JWT token>"
}
```

### Response

#### Success Response

- **Status Code:** 200 OK
- **Body:**

```json
{
  "message": "Logged out"
}
```

#### Error Responses

- **Status Code:** 401 Unauthorized

  - **Description:** Missing or invalid token.
  - **Body:**

  ```json
  {
    "message": "Authentication failed"
  }
  ```

- **Status Code:** 500 Internal Server Error
  - **Description:** An unexpected error occurred on the server.

### Example Request

```bash
curl -X GET \
  http://localhost:3000/users/logout \
  -H 'Authorization: Bearer <JWT token>'
```

### Example Response

#### Success

```json
{
  "message": "Logged out"
}
```

#### Error

```json
{
  "message": "Authentication failed"
}
```
