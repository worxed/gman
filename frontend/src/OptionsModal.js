import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './OptionsModal.css'; // Ensure the CSS file is imported

Modal.setAppElement('#root'); // Set the root element for accessibility

const OptionsModal = ({ isOpen, onRequestClose, onSaveConfig, steamApiKey, steamUserId }) => {
  const [localSteamApiKey, setLocalSteamApiKey] = useState(steamApiKey);
  const [localSteamUserId, setLocalSteamUserId] = useState(steamUserId);

  useEffect(() => {
    setLocalSteamApiKey(steamApiKey);
    setLocalSteamUserId(steamUserId);
  }, [steamApiKey, steamUserId]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    onSaveConfig(localSteamApiKey, localSteamUserId);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2>Options</h2>
      <form onSubmit={handleSaveConfig}>
        <div>
          <label>Steam API Key:</label>
          <input
            type="text"
            value={localSteamApiKey}
            onChange={(e) => setLocalSteamApiKey(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Steam User ID:</label>
          <input
            type="text"
            value={localSteamUserId}
            onChange={(e) => setLocalSteamUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};

export default OptionsModal;