const Trip = require("../models/Trip");

// Get all trips
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// Create a new trip
const createTrip = async (req, res) => {
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
};

// Get trip by ID
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ msg: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        res.status(400).json({ msg: 'Invalid ID', error: err.message });
    }
};

// Update trip
const updateTrip = async (req, res) => {
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrip) return res.status(404).json({ msg: 'Trip not found' });
        res.json(updatedTrip);
    } catch (err) {
        res.status(400).json({ msg: 'Invalid ID', error: err.message });
    }
};

// Delete trip
const deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
        if (!deletedTrip) return res.status(404).json({ msg: 'Trip not found' });
        res.json({ msg: 'Trip deleted successfully' });
    } catch (err) {
        res.status(400).json({ msg: 'Invalid ID', error: err.message });
    }
};

module.exports = {
    getTrips,
    createTrip,
    getTripById,
    updateTrip,
    deleteTrip
};
