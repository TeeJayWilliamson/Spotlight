import React from 'react';
import './Lightbox.css';

// Emblem data: image, title, description
const emblems = [
  {
    id: 'diversity',
    title: 'Diversity',
    image: 'path/to/emblem1.png', // Replace with actual image path
    description: 'For helping others see what is possible. You have gone above and beyond and deserve special thanks from your team.'
  },
  {
    id: 'leadership',
    title: 'Leadership',
    image: 'path/to/emblem2.png', // Replace with actual image path
    description: 'For taking charge when needed and leading by example. You inspire others with your vision and actions.'
  },
  {
    id: 'safety',
    title: 'Safety',
    image: 'path/to/emblem3.png', // Replace with actual image path
    description: 'For prioritizing the safety of the team and ensuring a secure environment for everyone.'
  },
  // Add more emblems as needed
];

function Lightbox({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay">
      <div className="lightbox">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>All Emblems</h2>
        <ul className="emblem-list">
          {emblems.map((emblem) => (
            <li key={emblem.id} onClick={() => onSelect(emblem)}>
              <img src={emblem.image} alt={emblem.title} />
              <h3>{emblem.title}</h3>
              <p>{emblem.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Lightbox;
