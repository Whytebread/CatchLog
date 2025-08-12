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



//AUTH routes

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

            const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            token,
            user: { id: user._id, email: user.email }
         });
    } catch (err) {
        res.status(500).json({ message: 'Signup error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ user: { id: user._id, email: user.email }, token });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

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