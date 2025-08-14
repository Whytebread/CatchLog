import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import AddTrip from "./Pages/AddTrip";
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import NavBar from "./Components/NavBar";
import ProtectedRoute from "./auth/ProtectedRoute";
import './App.css';
import { useAuth } from './auth/AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [trips, setTrips] = useState([]);
  const { getToken } = useAuth();

  const handleTripSave = (newTrip) => {
    const token = getToken();
    fetch('http://localhost:5002/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newTrip)
    })
      .then(res => res.json())
      .then(savedTrip => {
        setTrips(prev => [...prev, savedTrip]);
      })
      .catch(err => console.error("Error saving trip", err));
  };

  const handleTripEdit = (updatedTrip) => {
    const token = getToken();
    fetch(`http://localhost:5002/api/trips/${updatedTrip._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedTrip)
    })
      .then(res => res.json())
      .then(savedTrip => {
        setTrips(prev => prev.map(t => t._id === savedTrip._id ? savedTrip : t));
      })
      .catch(err => console.error('Error editing trip:', err));
  };

  return (
    <Router>
      <NavBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard trips={trips} setTrips={setTrips} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddTrip onSave={handleTripSave} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <AddTrip onEdit={handleTripEdit} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;
