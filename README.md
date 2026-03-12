# Fruit AI Backend API

Fruit AI is a backend service for a mobile application that allows users to identify fruits and check their quality using an AI model.

Users can upload fruit images, and the system processes the image, sends it to an AI service, and returns the fruit name along with its quality and confidence score.

The backend also includes authentication, user profile management, OTP-based password reset, and API security.

---

# Features

## Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using **bcrypt**

## Password Reset

* Forgot password using email
* Generate **OTP using crypto**
* Send OTP via email
* Verify OTP
* Reset password securely

## User Management

* Get user profile
* Update user name
* Update user email
* Update profile image

## Fruit Classification

* Upload fruit image
* Image optimization using **Sharp**
* Send image to AI service
* Receive fruit name, quality, and confidence
* Store classification result in **MongoDB**

## Security

* Request validation using **Zod**
* Password hashing using **bcrypt**
* Secure token generation using **crypto**
* **Rate limiting** to prevent abuse

## Performance

* Redis integration
* Optimized image processing

---

# Tech Stack

* Node.js
* TypeScript
* Express.js
* MongoDB
* Redis
* Zod
* JWT (jsonwebtoken)
* bcrypt
* crypto
* Multer
* Sharp
* Axios
* Nodemailer

---

# Project Structure

```id="0x0wzv"
src
│
├── controllers
│
├── services
│
├── models
│
├── routes
│
├── middleware
│
├── validators
│
├── utils
│
├── configs
│
├── types
│
└── server.ts
```

---

# Installation

Clone the repository

```id="z0oqeq"
git clone https://github.com/Ahmd-Bahgat/fruitAI-backend-api.git
```

Install dependencies

```id="h4i96y"
npm install
```

Run development server

```id="4ehcc3"
npm run dev
```

---

# Environment Variables

Create a `.env` file:

```id="o2ck3u"
BASE_URL=
PORT=
MONGO_URI=
SECRET_KEY=
NODE_ENV=
MOCK_AI_URL=
EMAIL_USER=
EMAIL_PASS=
```

---

# API Endpoints

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

## Password Reset

### Request Password Reset (Send OTP)

```
POST /api/auth/forgot-password
```

### Verify OPT and Reset Password 

```
POST /api/auth/reset-password
```

---

## User

### Get Profile

```
GET /api/user/profile
```

### Update Profile

```
PATCH /api/user/profile
```

### Update Profile Image

```
PATCH /api/user/update-image
```

---

## Fruit Classification

### Classify Fruit

```
POST /api/classification
```

Request (Form Data):

```
fruitImage: image file
```

Response Example:

```id="k8y8qh"
{
  "fruitName": "banana",
  "quality": "first grade",
  "confidence": 0.91
}
```

### Get Classifaction History

```
GET /api/classification
```

### Delete Classification

```
DELETE /api/classification/:id
```
---

# Security

The API includes several security features:

* JWT authentication
* bcrypt password hashing
* Zod request validation
* OTP verification for password reset
* Rate limiting to protect endpoints
* Secure token generation using Node.js crypto

---

# Image Processing

Uploaded images are processed using **Sharp**:

* Resize to maximum 1000px
* Optimized before sending to the AI service

---

# AI Integration

The backend sends the image to an AI classification service:

```
POST http://localhost:5000/predict
```

The AI service returns:

* fruit name
* fruit quality
* confidence score

---

# Future Improvements

* Deploy real AI fruit classification model
* Cloud image storage (AWS S3 / Cloudinary)
* Scan history for users
* Admin dashboard
* AI accuracy improvements

---

# Author

Ahmed Bahgat
https://github.com/Ahmd-Bahgat

