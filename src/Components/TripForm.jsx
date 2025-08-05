import React, { useState } from 'react';
import CatchEntry from '../Components/CatchEntry.jsx';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';



// *******IMPROVEMENTS/CHANGES******//
// either need to only have the catch delete button show if there is more than one catch entered or to not allow the delete if there is only one catch
// if no catch information is entered either display no catches or make it required, or a prompt that confirms no fish caught



// ensures the form is blank and so initialData can contain data that may need to be edited in the future
function TripForm({ onSubmit, initialData = null }) {
    const { user, getToken } = useContext(AuthContext);
    initialData = initialData || {};
    const [formData, setFormData] = useState({
        bodyOfWater: initialData?.bodyOfWater || '',
        weather: initialData?.weather || '',
        temperature: initialData?.temperature || '',
        catchDate: initialData?.catchDate
            ? new Date(initialData.catchDate).toISOString().split('T')[0]
            : '',
        notes: initialData?.notes || '',
        catches: initialData?.catches || [],
    });


    // records the values submitted in the input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // adds the input data for fish caught
    const addCatch = () => {
        setFormData({
            ...formData,
            catches: [...formData.catches, { species: '', weight: '', length: '', bait: '' }],
        });
    };

    // adds the new catches to the array
    const handleCatchChange = (index, updatedCatch) => {
        const newCatches = [...formData.catches];
        newCatches[index] = updatedCatch;
        setFormData({ ...formData, catches: newCatches });
    };

    // removes the data of the entered catch from the array after delete is clicked
    const handleRemoveCatch = (index) => {
        const newCatches = formData.catches.filter((_, i) => i !== index);
        setFormData({ ...formData, catches: newCatches });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // sends all the data to AddTrip (or EditTrip)
    };


    return (

        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            width: "100%",
        }}>
            <div className="form-container" style={{
                backgroundColor: '#FFFFFF',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                maxWidth: '700px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <h2 style={{
                    color: '#2B7A78',
                    textAlign: 'center',
                    marginBottom: '16px'
                }}>
                    {initialData ? 'Edit Trip' : 'Add New Trip'}
                </h2>

                <form style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    maxWidth: '600px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }} onSubmit={handleSubmit}>

                    <div className="form-group" style={formGroupStyle}>
                        <label>Body of Water</label>
                        <input
                            name="bodyOfWater"
                            type="text"
                            placeholder="Lake, stream, river, pond"
                            value={formData.bodyOfWater}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="form-group" style={formGroupStyle}>
                        <label>Date</label>
                        <input
                            name="catchDate"
                            type="date"
                            value={formData.catchDate}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="form-group" style={formGroupStyle}>
                        <label>Weather</label>
                        <input
                            name="weather"
                            type="text"
                            placeholder="(e.g., Sunny, 74°F)"
                            value={formData.weather}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </div>

                    <div className="form-group" style={formGroupStyle}>
                        <label>Temperature (°F)</label>
                        <input
                            name="temperature"
                            type="number"
                            placeholder="e.g., 74"
                            value={formData.temperature}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </div>

                    <div className="form-group" style={formGroupStyle}>
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            placeholder="Add additional notes (e.g., Best luck near reeds)"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group" style={catchSectionStyle}>
                        <h3 style={catchHeadingStyle}>Fish Caught</h3>
                        {formData.catches.map((catchData, index) => (
                            <div key={index}>
                                <CatchEntry
                                    index={index}
                                    catchData={catchData}
                                    onChange={handleCatchChange}
                                    onRemove={handleRemoveCatch}
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn-add-catch"
                            style={addCatchButtonStyle}
                            onClick={addCatch}
                        >
                            + Add Catch
                        </button>
                    </div>

                    <button type="submit" style={buttonPrimary}>Save Trip</button>
                </form>
            </div>

            <Link to="/" style={{ marginTop: '20px', color: '#2B7A78', textDecoration: 'underline' }}>
                ← Back to Dashboard
            </Link>
        </div >

    );
};


const inputStyle = {
    padding: '10px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '95%',
    boxsizing: 'border-box',
    marginTop: '5px'
};


const buttonPrimary = {
    backgroundColor: '#3AAFA9',
    color: '#FFFFFF',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
};

const addCatchButtonStyle = {
    backgroundColor: '#2B7A78',
    color: '#fff',
    border: 'none',
    padding: '20px 16px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
    marginTop: '10px'
};

const formGroupStyle = {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: "20px"
};

const catchSectionStyle = {
  backgroundColor: '#EDF7F6',
  padding: '16px',
  borderRadius: '10px',
  marginTop: '10px'
};

const catchHeadingStyle = {
  color: '#2B7A78',
  fontSize: '20px',
  marginBottom: '12px'
};


export default TripForm;