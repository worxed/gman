import React, { useState } from 'react';
import './BurgerMenu.css'; // Ensure the CSS file is imported

const BurgerMenu = ({ onOpenOptions, onScanGames, onUpdateGames, onClearDatabase, toggleTheme, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`burger-menu ${isOpen ? 'open' : ''}`}>
        <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={handleToggleMenu}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
      </div>
      <div className={`menu-content ${isOpen ? 'open' : ''}`}>
        <button onClick={onOpenOptions}>Open Options</button>
        <button onClick={onScanGames}>Scan Games</button>
        <button onClick={onUpdateGames}>Update Games</button>
        <button onClick={onClearDatabase}>Clear Database</button>
        <button onClick={toggleTheme}>
          Switch to {theme === 'dark-theme' ? 'Light' : 'Dark'} Theme
        </button>
      </div>
    </div>
  );
};

export default BurgerMenu;