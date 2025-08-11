const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
    getTrips,
    createTrip,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../controllers/tripController");

router.route("/")
    .get(requireAuth, getTrips)
    .post(requireAuth, createTrip);

router.route("/:id")
    .get(getTripById)
    .put(requireAuth, updateTrip)
    .delete(requireAuth, deleteTrip);

module.exports = router;
