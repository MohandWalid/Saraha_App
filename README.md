# Saraha App (Backend)

A backend-only clone of **Saraha**, the anonymous messaging platform, built as part of the **Route Academy** Node.js Backend Diploma. Users can create an account, share their profile link, and receive anonymous messages from anyone — without the sender's identity being revealed.

## Features

- 🔐 **Authentication & Authorization**
  - User signup with email verification
  - Login with JWT (Access & Refresh tokens)
  - Password hashing with bcrypt
  - Forgot password / reset password flow
  - Protected routes using JWT middleware

- 💬 **Messaging**
  - Send anonymous messages to any registered user
  - View all received messages (only the recipient can view them)
  - Delete a specific message
  - Sender identity is never stored/exposed

- 👤 **User Management**
  - Get logged-in user profile
  - Update user profile / password
  - Soft delete / deactivate account

- 🛡️ **Validation & Security**
  - Request validation using Joi
  - Centralized error handling
  - Rate limiting / helmet for basic security hardening

## Tech Stack

| Layer          | Technology            |
|----------------|------------------------|
| Runtime        | Node.js               |
| Framework      | Express.js             |
| Database       | MongoDB                |
| ODM            | Mongoose                |
| Authentication | JSON Web Token (JWT)    |
| Validation     | Joi                     |
| Password Hash  | bcrypt                  |
| Environment    | dotenv                  |

## Project Structure

```
saraha-app/
├── src/
│   ├── config/          # DB connection & environment setup
│   ├── modules/         # Feature modules (auth, user, message)
│   │   ├── auth/
│   │   ├── user/
│   │   └── message/
│   ├── DB/
│   │   ├── models/      # Mongoose schemas
│   ├── middleware/       # Auth guard, error handling, validation
│   ├── utils/            # Helper functions (token, email, etc.)
│   └── index.js          # App entry point
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas cluster)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/saraha-app.git
cd saraha-app

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=3000
DB_URI=mongodb://localhost:27017/saraha-app
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

### Run the App

```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Auth

| Method | Endpoint                     | Description                |
|--------|-------------------------------|-----------------------------|
| POST   | `/auth/signup`                | Register a new user         |
| POST   | `/auth/login`                 | Login and receive tokens    |
| GET    | `/auth/verify/:token`         | Verify email                |
| POST   | `/auth/forgot-password`       | Request password reset      |
| POST   | `/auth/reset-password`        | Reset password               |

### User

| Method | Endpoint          | Description               |
|--------|--------------------|-----------------------------|
| GET    | `/user/profile`   | Get logged-in user profile |
| PUT    | `/user/profile`   | Update profile              |
| DELETE | `/user/profile`   | Delete/deactivate account   |

### Message

| Method | Endpoint                  | Description                        |
|--------|-----------------------------|--------------------------------------|
| POST   | `/message/send/:userId`    | Send an anonymous message to a user |
| GET    | `/message`                 | Get all messages for logged-in user |
| DELETE | `/message/:messageId`      | Delete a specific message           |

> **Note:** Adjust the routes above to match your actual implementation.

## Testing the API

You can test the endpoints using **Postman** or **Thunder Client**. A Postman collection can be added at `docs/postman_collection.json` for convenience.

## Author

Built by **[Your Name]** as part of the Route Academy Backend Diploma.

## License

This project is licensed under the MIT License.
