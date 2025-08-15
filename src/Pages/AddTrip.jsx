import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TripForm from '../Components/TripForm.jsx';
import useAuth from "../hooks/useAuth";
import { validateTrip } from "../utils/validate";
import { toast } from "react-toastify";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

function AddTrip({ onSave, onEdit }) {
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state?.initialData;

    const { getToken } = useAuth();


    const handleTripSubmit = async (tripData) => {
        try {
            const validationError = validateTrip(tripData);
            if (validationError) {
                toast.warn(validationError);
                return;
            }
            const token = getToken();
            if (!token) {
                toast.error("You must be logged in to save a trip.");
                navigate("/login");
                return;
            }

            const url = initialData
                ? `${API_BASE_URL}/api/trips/${initialData._id}`
                : `${API_BASE_URL}/api/trips`;

            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tripData)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || `Trip ${initialData ? "update" : "creation"} failed`);
            }

            toast.success(initialData ? "Trip updated successfully!" : "Trip created successfully!");

            navigate('/');
        } catch (err) {
            console.error("Trip submit error:", err);
            toast.error(err.message || "There was an error saving your trip.");
        }
    };


    return (
        <div style={{ backgroundColor: "#DEF2F1", minHeight: "100vh" }}>


            <div style={{ padding: '40px 20px' }}>
                <TripForm initialData={initialData} onSubmit={handleTripSubmit} />
            </div>
        </div>
    );

};





export default AddTrip;