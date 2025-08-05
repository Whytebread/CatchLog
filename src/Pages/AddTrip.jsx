import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TripForm from '../Components/TripForm.jsx';
import useAuth from "../hooks/useAuth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5002';

function AddTrip({ onSave, onEdit }) {
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state?.initialData;

    const { getToken } = useAuth();
    

    const handleTripSubmit = async (tripData) => {
        try {
            const token = getToken();
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
                const errorText = await res.text(); //debugging
                console.error("Trip creation error response:", errorText); //debugging
                throw new Error(`Trip ${initialData ? 'update' : 'creation'} failed`);
            }

            navigate('/');
        } catch (err) {
            console.error("Trip submit error:", err);
            alert("There was an error saving your trip.");
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