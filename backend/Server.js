const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const requireAuth = require('./middleware/requireAuth');


const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env');
    process.exit(1);
}

//Import user and trip modules
const User = require('./models/User');
const Trip = require('./models/Trip');
const tripRoutes = require("./routes/tripRoutes");
const userRoutes = require("./routes/userRoutes");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/CatchLog')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Mongo Error:', err));

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CatchLog API is running' });
});

// API trip routes
app.use("/api/trips", tripRoutes);

// User routes
app.use("/api/users", userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'CatchLog API',
        endpoints: [
            'GET /api/health',
            'GET /api/trips',
            'POST /api/trips',
            'GET /api/trips/:id',
            'PUT /api/trips/:id',
            'DELETE /api/trips/:id',
            'POST /api/auth/login',
            'POST /api/auth/signup'
        ]
    });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} in use. Try another port.`);
        } else {
            console.error('Server error:', err);
        }
    });