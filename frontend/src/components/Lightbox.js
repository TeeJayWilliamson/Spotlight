import React from 'react';
import './Lightbox.css';

function Lightbox({ isOpen, onClose, onSelect }) {
  const emblems = [
    'Emblem 1',
    'Emblem 2',
    'Emblem 3',
    // Add more emblems as needed
  ];

  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay">
      <div className="lightbox">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Select an Emblem</h2>
        <ul className="emblem-list">
          {emblems.map((emblem, index) => (
            <li key={index} onClick={() => onSelect(emblem)}>
              {emblem}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Lightbox;
