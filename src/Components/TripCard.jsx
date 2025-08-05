import React from 'react';

// ***************IMPROVEMENTS****************


function TripCard({ trip, onEdit, onRequestDelete }) {
    const formattedDate = new Date(trip.catchDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div style={cardStyle}>
            <div style={{ flexGrow: 1 }}>
                <h2>{trip.bodyOfWater} - {formattedDate}</h2>
                <p><strong>⛅️ Weather:</strong> {trip.weather}</p>
                <p><strong>🌡️ Temperature:</strong> {trip.temperature}°F</p>
                <div style={{ marginTop: '12px' }}>
                    <p><strong>📝 Notes:</strong> {trip.notes}</p>
                </div>

                <div style={catchesSectionStyle}>
                    <h4 style={catchesTitleStyle}>🎣 Catches</h4>
                    <ul style={catchListStyle}>
                        {Array.isArray(trip.catches) && trip.catches.map((c, index) => (
                            <li key={index}>
                                {c.species} — {c.weight} lbs, {c.length} in, Bait: {c.bait}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={buttonRow}>
                <button style={editButtonStyle} onClick={() => onEdit(trip)}>Edit</button>
                <button style={deleteButtonStyle} onClick={() => onRequestDelete(trip)}>Delete</button>
            </div>
        </div>
    );
};

const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '500px',
};

const buttonRow = {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '16px'
};

const editButtonStyle = {
    backgroundColor: '#2B7A78',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '6px',
    cursor: 'pointer'
};

const deleteButtonStyle = {
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '6px',
    cursor: 'pointer'
};

const catchesSectionStyle = {
    backgroundColor: '#EDF7F6',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '10px'
};

const catchesTitleStyle = {
    color: '#2B7A78',
    marginBottom: '8px',
    marginTop: "0px",
    fontSize: '20px',
    maxheight: '120px'
};

const catchListStyle = {
    listStyleType: 'disc',
    paddingLeft: '20px',
    margin: 0
};


export default TripCard;