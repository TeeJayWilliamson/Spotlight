import React from 'react';
import './Lightbox.css';

// Emblem data: image, title, description
const emblems = [
  {
    id: 'diversity',
    title: 'Diversity',
    image: require('../img/diversity.png'), // Replace with actual image path
    description: 'For helping others see what is possible. You have gone above and beyond and deserve special thanks from your team.'
  },
  {
    id: 'leadership',
    title: 'Leadership',
    image: require('../img/leadership.png'), // Replace with actual image path
    description: 'For taking charge when needed and leading by example. You inspire others with your vision and actions.'
  },
  {
    id: 'safety',
    title: 'Safety',
    image: require('../img/safety.png'), // Replace with actual image path
    description: 'For prioritizing the safety of the team and ensuring a secure environment for everyone.'
  },
  {
    id: 'initiative',
    title: 'Initiative',
    image: require('../img/initiative.png'), // Replace with actual image path
    description: 'For going above and beyond in solving problems and taking proactive steps to improve the workplace.'
  },
  {
    id: 'respect-and-dignity',
    title: 'Respect and Dignity',
    image: require('../img/respect.png'), // Replace with actual image path
    description: 'For treating everyone with kindness and empathy, fostering an environment of respect and dignity.'
  },
  {
    id: 'teamwork',
    title: 'Teamwork',
    image: require('../img/teamwork.png'), // Replace with actual image path
    description: 'For collaborating effectively with others and contributing to the success of the team.'
  },
  {
    id: 'innovation',
    title: 'Innovation',
    image: require('../img/innovation.png'), // Replace with actual image path
    description: 'For coming up with creative solutions that have had a positive impact on the team or the company.'
  }
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
