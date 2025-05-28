
---

## ✅ **Boom Backend - `README.md`**

```md
# 💻 Boom - Backend

This is the backend for the Boom platform – a video-sharing and creator-monetization application built with Node.js and MongoDB.

---

## 🔗 Related Repositories

- 🔮 Frontend: [Boom-Frontend](https://github.com/Harisankar705/Boom-Frontend)
- 📺 Walkthrough: [YouTube Demo](https://www.youtube.com/watch?v=0mQErryCRSE)

---

## 🧰 Tech Stack

- Node.js + Express.js
- MongoDB with Mongoose
- TypeScript
- JWT Authentication
- Google OAuth Integration
- REST API design

---

## 🔐 Features

- User Registration & Login (Email + Google OAuth)
- Upload & fetch videos
- Wallet-based video purchase & gifting system
- Creator wallet payout logic
- Middleware-auth protected routes

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Harisankar705/Boom-backend.git
cd Boom-backend
2. Install Dependencies

npm install
3. Setup Environment Variables
Create a .env file in the root:

env

PORT=5000
MONGO_URI=mongodb://localhost:27017/boom
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
4. Run the Server

npm run dev
Make sure MongoDB is running locally, or provide a cloud DB connection string.

📁 Project Structure

src/
├── controllers/        // Route logic
├── models/             // Mongoose schemas
├── routes/             // API endpoints
├── services/           // Business logic (wallet, auth)
├── middlewares/        // Auth & error handling
└── utils/              // Google OAuth, helpers
🧪 API Endpoints (Sample)
POST /auth/register – User registration

POST /auth/login – Login

POST /auth/google – Google login

GET /auth/me – Get current user info

POST /videos/upload – Upload a video

POST /videos/purchase – Purchase a video

POST /gifts/send – Send gift to a creator

📄 License
This project is licensed under the MIT License.



---

Let me know if you want me to include **screenshots**, a **Postman collection**, or an **OpenAPI (Swagger) spec** for your API!