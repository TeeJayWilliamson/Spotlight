import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart = [], setCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const userPoints = 1000;

  const cartTotal = cart.reduce((sum, item) => sum + item.points * (item.quantity || 1), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const canCheckout = userPoints >= cartTotal;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCart([]);
      alert('Checkout successful! Your gift cards have been redeemed.');
      navigate('/rewards');
    }, 2000);
  };

  if (!cart || cart.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button 
          onClick={() => navigate('/rewards')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Return to Rewards
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Checkout</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Your Points</h2>
        <p>Available Points: {userPoints}</p>
        <p>Total Cost: {cartTotal}</p>
        <p>Remaining Points: {userPoints - cartTotal}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Cart Items ({cartItemCount})</h2>
        {cart.map((item) => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #eee'
          }}>
            <img 
              src={item.image} 
              alt={item.name} 
              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
            />
            <div>
              <h4>{item.name} x{item.quantity || 1}</h4>
              <p>{item.points * (item.quantity || 1)} pts</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCheckout}
        disabled={!canCheckout || isProcessing}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: canCheckout ? '#621E8B' : 'gray',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: canCheckout ? 'pointer' : 'not-allowed',
        }}
      >
        {isProcessing ? 'Processing...' : canCheckout ? 'Complete Redemption' : 'Insufficient Points'}
      </button>
    </div>
  );
};

export default Checkout;
