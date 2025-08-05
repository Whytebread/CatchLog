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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/CatchLog')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Mongo Error:', err));

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CatchLog API is running' });
});

// GET all trips
app.get('/api/trips', requireAuth, async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// POST new trip
app.post('/api/trips', requireAuth, async (req, res) => {
    try {
        if (!req.body.catches || req.body.catches.length === 0 || !req.body.catches[0].species) {
            return res.status(400).json({ msg: 'At least one catch with species is required' });
        }
        const trip = new Trip({
            ...req.body,
            user: req.userId
        });

        const savedTrip = await trip.save();
        res.status(201).json(savedTrip);
    } catch (err) {
        res.status(400).json({ msg: 'Error creating trip', error: err.message });
    }
});

// GET single Trip by ID
app.get('/api/trips/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ msg: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        res.status(400).json({ msg: 'Invalid ID', error: err.message });
    }
});

// PUT update trip
app.put('/api/trips/:id', requireAuth, async (req, res) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrip) return res.status(404).json({ msg: 'Trip not found' });
        res.json(updatedTrip);
    } catch (err) {
        res.status(400).json({ msg: 'Invalid ID', error: err.message });
    }
});

// DELETE trip
app.delete('/api/trips/:id', requireAuth, async (req, res) => {
    try {
        const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
        if (!deletedTrip) return res.status(404).json({ msg: 'Trip not found' });
        res.json({ msg: 'Trip deleted successfully' });
    } catch (err) {
        res.status(400).json({ msg: 'Invalid ID', error: err.message });
    }
});

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
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));