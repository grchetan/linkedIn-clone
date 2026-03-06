# LinkedIn Clone Backend

Node.js + Express + MongoDB backend API for a LinkedIn-style app.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs password hashing
- Multer image upload

## Project Structure

```text
backend/
 ├── models/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── config/
 ├── uploads/
 ├── server.js
 └── .env.example
```

## Setup & Run

1. Go to backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment file:
   ```bash
   cp .env.example .env
   ```
4. Update values in `.env` as needed.
5. Start development server:
   ```bash
   npm run dev
   ```
6. Or start normally:
   ```bash
   npm start
   ```

Server default URL: `http://localhost:5000`

## API Routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Users
- `POST /api/users/profile` (create/update profile)
- `PUT /api/users/profile` (edit profile)
- `GET /api/users/profile/:id`
- `GET /api/users/search?q=<name>`

### Posts
- `POST /api/posts/create` (text + optional image)
- `GET /api/posts/feed`
- `POST /api/posts/like`
- `POST /api/posts/comment`
- `DELETE /api/posts/delete`

### Connections
- `POST /api/connections/send`
- `POST /api/connections/accept`
- `GET /api/connections/list`

## Request Notes
- Protected routes require:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- Image upload fields:
  - Profile picture field name: `profilePicture`
  - Post image field name: `image`

## Data Models
- `User`
- `Post`
- `Comment`
- `Connection`
