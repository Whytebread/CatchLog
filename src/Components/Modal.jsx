import React from 'react';



function Modal({ message, onConfirm, onCancel }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>This action cannot be undone. Are you sure you want to continue?</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
          <button onClick={onConfirm} style={deleteButtonStyle}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// Styling

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  minWidth: '300px'
};

const cancelButtonStyle = {
  backgroundColor: '#2B7A78',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const deleteButtonStyle = {
  backgroundColor: '#d9534f',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
};



export default Modal;