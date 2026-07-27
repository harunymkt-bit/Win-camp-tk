# Setup Guide

## Prerequisites
- Node.js v16+
- PostgreSQL
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/harunymkt-bit/Win-camp-tk.git
cd Win-camp-tk
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/casino_games
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

### 4. Database Setup
```bash
npm run migrate
npm run seed
```

### 5. Start Backend Server
```bash
npm start
```

### 6. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

Server will run on `http://localhost:5000`
Frontend will run on `http://localhost:3000`
