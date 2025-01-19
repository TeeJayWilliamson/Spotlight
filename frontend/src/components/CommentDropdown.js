import React, { useState } from 'react';

const CommentDropdown = ({ postId, onCommentSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const presetComments = [
    "Great achievement! 👏",
    "Well deserved! 🌟",
    "Inspiring work! 💫",
    "Amazing contribution! 🎯",
    "Outstanding job! 🏆",
    "Excellent work! 💪"
  ];

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleCommentSelect = async (comment) => {
    try {
      await onCommentSubmit(postId, comment);
      setComments([...comments, comment]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleButtonClick}
        style={{ 
          textDecoration: 'none', 
          color: '#621E8B', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer'
        }}
      >
        Comment
      </button>
      
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100%',
            right: '0',
            marginBottom: '8px',
            width: '200px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #ddd',
            zIndex: 1000
          }}
        >
          {presetComments.map((comment, index) => (
            <button
              key={index}
              onClick={() => handleCommentSelect(comment)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                border: 'none',
                borderBottom: index < presetComments.length - 1 ? '1px solid #eee' : 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#621E8B'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {comment}
            </button>
          ))}
        </div>
      )}
      
      {comments.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          {comments.map((comment, index) => (
            <div 
              key={index}
              style={{
                padding: '8px',
                backgroundColor: '#f8f8f8',
                borderRadius: '4px',
                marginBottom: '4px',
                fontSize: '14px',
                color: '#666'
              }}
            >
              {comment}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentDropdown;