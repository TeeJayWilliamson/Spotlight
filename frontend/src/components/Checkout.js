import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext
import axios from 'axios';

const Checkout = ({ cart = [], setCart }) => {
  const navigate = useNavigate();
  const { pointBalance, setPointBalance } = useContext(UserContext); // Use UserContext
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.points * (item.quantity || 1), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const canCheckout = pointBalance >= cartTotal;

  const handleCheckout = async () => {
    if (!canCheckout) return; // Prevent checkout if insufficient points

    setIsProcessing(true);
    try {
      // Use full API URL
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/redeem-points`, {
        username: localStorage.getItem('username'),
        pointsToDeduct: cartTotal,
      });

      // Update the point balance in context
      setPointBalance(response.data.newBalance);

      // Clear the cart
      setCart([]);
      alert('Checkout successful! Your gift cards have been redeemed.');
      navigate('/rewards');
    } catch (error) {
      alert(error.response?.data?.message || 'Redemption failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };


  if (!cart || cart.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button 
          onClick={() => navigate('/rewards')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#621E8B',
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
        <p>Available Points: {pointBalance}</p>
        <p>Total Cost: {cartTotal} pts</p>
        <p>Remaining Points: {pointBalance - cartTotal} pts</p>
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
