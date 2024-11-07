import React from 'react';
import './MessageOverlay.css'; // Ensure the CSS file is imported

const MessageOverlay = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>×</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default MessageOverlay;