# AI Travel Planner — Backend

AI-powered travel planning backend built with Node.js, Express.js, MongoDB, JWT Authentication, and Google Gemini AI

**Live API:** [https://travelbackend-1-3zq9.onrender.com](https://travelbackend-1-3zq9.onrender.com)  
**Frontend Repo:** [https://github.com/12345-dd/travelFrontend](https://github.com/12345-dd/travelFrontend)  
**Live Website:** [https://smarttripai.netlify.app](https://smarttripai.netlify.app)

---

## Features

- **JWT Authentication** — Secure token-based auth
- **Protected API Routes** — Middleware to guard private endpoints
- **MongoDB Integration** — Persistent data storage with Mongoose
- **AI-Travel Itineary Generation** - Ai makes schedule for each day
- **Password Hashing** — Bcrypt for secure password storage
- **AI-Packing List Generation** - feature that tell user what to pack for the place they visit
- **Add Custom Activities** - User can add activity based on their choice
- **User-specific Trip Management** - User getting all their trips on dashboard

---

## Getting Started (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/12345-dd/travelBackend
cd travelBackend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File
```env
PORT=4000
MONGO_URI=
your_mongodb_atlas_connection_string
JWT_SECRET= your_jwt_secret_key
API_KEY= GEMINI_key
```

### 4. Run the Server
```bash
node app.js
```

> Server runs on `http://localhost:4000`

---


## Deployment

- Backend is deployed on **Render**
- Live API URL: [https://travelbackend-1-3zq9.onrender.com](https://travelbackend-1-3zq9.onrender.com)

---