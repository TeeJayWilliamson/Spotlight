import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext
import './Rewards.css';

const Rewards = ({ cart = [], setCart }) => {
  const { pointBalance, setPointBalance } = useContext(UserContext); // 
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("Low");
    const [redeemableOnly, setRedeemableOnly] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartMinimized, setIsCartMinimized] = useState(false);

    const giftCards = [
      { id: 1, name: "Canadian Tire Gift Card", category: "Retail & Home Improvement", points: 100, redeemable: true, image: "/img/giftcards/canadian-tire-gc.jpg" },
      { id: 2, name: "Tim Hortons Gift Card", category: "Dining & Food Delivery", points: 50, redeemable: true, image: "/img/giftcards/tim-hortons-gc.jpg" },
      { id: 3, name: "Hudson's Bay Gift Card", category: "Retail & Home Improvement", points: 150, redeemable: true, image: "/img/giftcards/hudsons-bay-gc.jpg" },
      { id: 4, name: "Loblaws Gift Card", category: "Groceries & General", points: 200, redeemable: true, image: "/img/giftcards/loblaws-gc.jpg" },
      { id: 5, name: "Air Canada Gift Card", category: "Travel & Transportation", points: 500, redeemable: true, image: "/img/giftcards/air-canada-gc.jpg" },
      { id: 6, name: "Best Buy Gift Card", category: "Electronics & Entertainment", points: 300, redeemable: true, image: "/img/giftcards/best-buy-gc.jpg" },
      { id: 7, name: "Sport Chek Gift Card", category: "Retail & Home Improvement", points: 120, redeemable: true, image: "/img/giftcards/sportchek-gc.jpg" },
      { id: 8, name: "Chapters Gift Card", category: "Retail & Home Improvement", points: 75, redeemable: true, image: "/img/giftcards/chapters-gc.jpg" },
      { id: 9, name: "SkipTheDishes Gift Card", category: "Dining & Food Delivery", points: 100, redeemable: true, image: "/img/giftcards/skip-gc.jpg" },
      { id: 10, name: "Shoppers Drug Mart Gift Card", category: "Health, Beauty & Wellness", points: 130, redeemable: true, image: "/img/giftcards/shoppers-gc.jpg" },
      { id: 11, name: "Starbucks Gift Card", category: "Dining & Food Delivery", points: 60, redeemable: true, image: "/img/giftcards/starbucks-gc.jpg" },
      { id: 12, name: "WestJet Gift Card", category: "Travel & Transportation", points: 450, redeemable: true, image: "/img/giftcards/westjet-gc.jpg" },
      { id: 13, name: "Cineplex Gift Card", category: "Electronics & Entertainment", points: 80, redeemable: true, image: "/img/giftcards/cineplex-gc.jpg" },
      { id: 14, name: "Sobeys Gift Card", category: "Groceries & General", points: 220, redeemable: true, image: "/img/giftcards/sobeys-gc.jpg" },
      { id: 15, name: "Uber Gift Card", category: "Travel & Transportation", points: 110, redeemable: true, image: "/img/giftcards/uber-gc.jpg" },
      { id: 16, name: "LCBO Gift Card", category: "Beverages", points: 150, redeemable: true, image: "/img/giftcards/lcbo-gc.jpg" },
      { id: 17, name: "Amazon.ca Gift Card", category: "Retail & Home Improvement", points: 200, redeemable: true, image: "/img/giftcards/amazon-gc.jpg" },
      { id: 18, name: "Petro-Canada Gift Card", category: "Travel & Transportation", points: 100, redeemable: true, image: "/img/giftcards/petro-canada-gc.jpg" },
      { id: 19, name: "Pizza Pizza Gift Card", category: "Dining & Food Delivery", points: 70, redeemable: true, image: "/img/giftcards/pizza-pizza-gc.jpg" },
      { id: 20, name: "RONA Gift Card", category: "Retail & Home Improvement", points: 175, redeemable: true, image: "/img/giftcards/rona-gc.jpg" },
      { id: 21, name: "The Keg Gift Card", category: "Dining & Food Delivery", points: 150, redeemable: true, image: "/img/giftcards/the-keg-gc.jpg" },
      { id: 22, name: "WaySpa Gift Card", category: "Health, Beauty & Wellness", points: 180, redeemable: true, image: "/img/giftcards/wayspa-gc.jpg" },
      { id: 23, name: "Costco Gift Card", category: "Groceries & General", points: 250, redeemable: true, image: "/img/giftcards/costco-gc.jpg" },
      { id: 24, name: "Apple Gift Card", category: "Electronics & Entertainment", points: 300, redeemable: true, image: "/img/giftcards/apple-gc.jpg" },
      { id: 25, name: "Netflix Gift Card", category: "Electronics & Entertainment", points: 100, redeemable: true, image: "/img/giftcards/netflix-gc.jpg" },
      { id: 26, name: "Sephora Gift Card", category: "Health, Beauty & Wellness", points: 125, redeemable: true, image: "/img/giftcards/sephora-gc.jpg" },
      { id: 27, name: "Prepaid Visa Gift Card", category: "Groceries & General", points: 500, redeemable: true, image: "/img/giftcards/visa-gc.jpg" },
      { id: 28, name: "IKEA Gift Card", category: "Retail & Home Improvement", points: 200, redeemable: true, image: "/img/giftcards/ikea-gc.jpg" },
      { id: 29, name: "Golf Town Gift Card", category: "Retail & Home Improvement", points: 170, redeemable: true, image: "/img/giftcards/golf-town-gc.jpg" },
      { id: 30, name: "Boston Pizza Gift Card", category: "Dining & Food Delivery", points: 80, redeemable: true, image: "/img/giftcards/boston-pizza-gc.jpg" },
  ];

  const cartTotal = cart.reduce((sum, item) => sum + item.points * (item.quantity || 1), 0);

  const handleAddToCart = (card) => {
    if (!card.redeemable) {
      alert('This gift card is not redeemable.');
      return;
    }

    // Check if user has enough points
    const potentialCartTotal = cart.reduce((sum, item) => sum + item.points * (item.quantity || 1), 0) + card.points;
    
    if (potentialCartTotal > pointBalance) {
      alert(`Insufficient points. Your current balance is ${pointBalance} pts.`);
      return;
    }

    const existingCardIndex = cart.findIndex(item => item.id === card.id);
    if (existingCardIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingCardIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...card, quantity: 1 }]);
    }
    setIsCartOpen(true);
    setIsCartMinimized(false);
  };

  const handleRemoveFromCart = (cardId) => {
    const updatedCart = cart.map(item => 
      item.id === cardId
        ? { ...item, quantity: (item.quantity || 1) - 1 }
        : item
    ).filter(item => item.quantity > 0);

    setCart(updatedCart);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const filteredGiftCards = giftCards
    .filter((card) => (category === "All" ? true : card.category === category))
    .filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((card) => (redeemableOnly ? card.redeemable : true))
    .sort((a, b) => (sortOrder === "Low" ? a.points - b.points : b.points - a.points));

  // Cart Component
  const Cart = () => (
    <div 
      className={`cart-sidebar ${isCartMinimized ? 'minimized' : ''}`}
      style={{ right: isCartOpen ? '0' : '-400px' }}
    >
      <div className="cart-header">
        {!isCartMinimized && (
          <>
            <h2>Your Cart ({cartItemCount})</h2>
            <p>Available Points: {pointBalance} pts</p>
          </>
        )}
        <div>
          <button 
            className="cart-button" 
            onClick={() => setIsCartMinimized(!isCartMinimized)}
          >
            {isCartMinimized ? '↔️' : '⬅️'}
          </button>
          <button 
            className="cart-button" 
            onClick={() => setIsCartOpen(false)}
          >
            ×
          </button>
        </div>
      </div>

      {!isCartMinimized && (
        <>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-image" 
                  />
                  <div className="cart-item-details">
                    <h4>{item.name} x{item.quantity}</h4>
                    <p>{item.points * item.quantity} pts</p>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
              <div className="cart-total">
                <h3>Total: {cartTotal} pts</h3>
                <Link to="/checkout">
                  <button 
                    className="checkout-button"
                    disabled={cartTotal > pointBalance}
                  >
                    Proceed to Checkout ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </button>
                </Link>
              </div>
            </>
          )}
        </>
      )}

      {isCartMinimized && (
        <div className="minimized-cart-content">
          <p className="vertical-text">Cart ({cart.length})</p>
          <p className="vertical-text">{cartTotal} pts</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="rewards-container">

      {/* Main Layout for Filters and Gift Cards */}
      <div className="rewards-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <h2>Filters</h2>

          {/* Search Filter */}
          <div className="filter-group">
            <label>
              Search:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gift cards..."
                className="filter-input"
              />
            </label>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label>
              Category:
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="filter-input"
              >
                <option value="All">All</option>
                <option value="Retail & Home Improvement">Retail & Home Improvement</option>
                <option value="Dining & Food Delivery">Dining & Food Delivery</option>
                <option value="Travel & Transportation">Travel & Transportation</option>
                <option value="Electronics & Entertainment">Electronics & Entertainment</option>
                <option value="Health, Beauty & Wellness">Health, Beauty & Wellness</option>
                <option value="Groceries & General">Groceries & General</option>
                <option value="Beverages">Beverages</option>
              </select>
            </label>
          </div>

          {/* Sort Order Filter */}
          <div className="filter-group">
            <label>
              Sort by Points:
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-input"
              >
                <option value="Low">Low to High</option>
                <option value="High">High to Low</option>
              </select>
            </label>
          </div>

          {/* Redeemable Only Checkbox */}
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={redeemableOnly}
                onChange={(e) => setRedeemableOnly(e.target.checked)}
              />
               Redeemable Only
            </label>
          </div>
        </div>

        {/* Point Balance Display */}
<div className="point-balance-display">
  <p>Current Points: {pointBalance} pts</p>
</div>


        </div>
                {/* Gift Cards Grid */}
                <div className="gift-cards-grid">
          {filteredGiftCards.map((card) => (
            <div key={card.id} className="gift-card">
              <img src={card.image} alt={card.name} className="gift-card-image" />
              <h3>{card.name}</h3>
              <p>{card.points} pts</p>
              <button 
                onClick={() => handleAddToCart(card)}
                disabled={card.points > pointBalance}
              >
                Add to Cart
              </button>
            </div>
          ))}

        {/* Cart Component */}
        <Cart />
      </div> {/* End of rewards-content */}
      
    </div> // End of rewards-container
  );
};

export default Rewards;