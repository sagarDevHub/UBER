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
