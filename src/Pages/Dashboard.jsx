import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripCard from '../Components/TripCard';
import Modal from '../Components/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';



// ********IMPROVEMENTS/CHANGES*********//
// expandable catches
// weather api
// user login
// fish picture

function Dashboard({ trips, setTrips }) {

  const [showModal, setShowModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [tripToEdit, setTripToEdit] = useState(null);
  const { getToken } = useAuth();
  const navigate = useNavigate();


  // fetches the trip data from the backend
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login'); //Redirect to login if no token
      return;
    }
    fetch('http://localhost:5002/api/trips', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched trips from backend:", data);
        //prevents a crash when a new user signs up and will return and empty array because there are no trips yet to fetch
        if (Array.isArray(data)) {
          setTrips(data);
        } else {
          console.log("Expected an array, got:", data);
          setTrips([]); 
        }
      })
      .catch(err => console.error('Error fetching trips:', err));
  }, [getToken, setTrips, navigate]);

  // shows the modal to confirm delete when delete button is clicked
  const handleRequestDelete = (trip) => {
    setTripToDelete(trip);
    setShowModal(true);
  };

  // deletes the trip data shown in the card when the confirm delete button is clicked
  const confirmDelete = () => {
    const token = getToken();
    fetch(`http://localhost:5002/api/trips/${tripToDelete._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setTrips(prevTrips => prevTrips.filter(t => t !== tripToDelete));
        setTripToDelete(null);
        setShowModal(false);
      })
      .catch(err => console.log("Error deleting trip", err))
    setShowModal(false)
  };

  // cancels the delete action and closes the modal
  const cancelDelete = () => {
    setTripToDelete(null);
    setShowModal(false);
  };

  // passes the trip data and allows editing in the tripForm component
  const handleEdit = (trip, index) => {
    navigate("/edit", { state: { initialData: { ...trip, index } } });
  };

  return (
    <div style={{ backgroundColor: "#DEF2F1", minHeight: "100vh" }}>

      {/* If no trips are logged, a display reflects this */}
      {trips.length === 0 ? (
        <main style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '40px'
        }}>

          <h2 style={{ color: "#2B7A78" }}>No Trips Yet</h2>
          <div style={{ fontSize: "60px" }}>🎣</div>
          <p style={{ color: "#555" }}>Start logging your fishing adventures to build your CatchLog history</p>

          {/* Button to go to the Add Trip page */}
          <Link to="/add">
            <button style={{
              marginTop: "20px",
              padding: "12px 24px",
              backgroundColor: "#3AAFA9",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}>
              + New Trip
            </button>
          </Link>
        </main>

      ) : (
        <div>
          {/* loop through trips and display each */}

          <div style={cardGridStyle}>
            {trips.map((trip, index) => (
              <TripCard
                key={index}
                trip={trip}
                onEdit={() => handleEdit(trip, index)}
                onRequestDelete={handleRequestDelete}
              />
            ))}
          </div>

          <p>You have {trips.length} trips logged.</p>

          {showModal && (
            <Modal
              message="Are you sure you want to delete this trip? This action cannot be undone. Are you sure you want to continue?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}

// card layout

const cardGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  padding: '20px'
};

const headerStyle = {
  backgroundColor: "#2B7A78",
  padding: "16px 24px",
  color: "white"
};

const headerContentStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "bold"
};

const addButtonStyle = {
  backgroundColor: "#3AAFA9",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer"
};


export default Dashboard;