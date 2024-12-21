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
      image: './img/leadership.png', // Replace with actual image path
      description: 'For taking charge when needed and leading by example. You inspire others with your vision and actions.'
    },
    {
      id: 'safety',
      title: 'Safety',
      image: 'path/to/emblem3.png', // Replace with actual image path
      description: 'For prioritizing the safety of the team and ensuring a secure environment for everyone.'
    },
    {
      id: 'initiative',
      title: 'Initiative',
      image: 'path/to/emblem4.png', // Replace with actual image path
      description: 'For going above and beyond in solving problems and taking proactive steps to improve the workplace.'
    },
    {
      id: 'respect-and-dignity',
      title: 'Respect and Dignity',
      image: 'path/to/emblem5.png', // Replace with actual image path
      description: 'For treating everyone with kindness and empathy, fostering an environment of respect and dignity.'
    },
    {
      id: 'teamwork',
      title: 'Teamwork',
      image: 'path/to/emblem6.png', // Replace with actual image path
      description: 'For collaborating effectively with others and contributing to the success of the team.'
    },
    {
      id: 'innovation',
      title: 'Innovation',
      image: 'path/to/emblem7.png', // Replace with actual image path
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
