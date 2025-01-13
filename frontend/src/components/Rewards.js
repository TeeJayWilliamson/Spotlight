  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import './Rewards.css';

  const Rewards = ({ cart = [], setCart }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("Low");
    const [redeemableOnly, setRedeemableOnly] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartMinimized, setIsCartMinimized] = useState(false);

    // Sample gift card data
    const giftCards = [
      { id: 1, name: "Canadian Tire Gift Card", category: "Retail & Home Improvement", points: 100, redeemable: true, image: "https://i.pinimg.com/736x/d6/2b/97/d62b97460bba53316169d39d03a7ef6e.jpg" },
      { id: 2, name: "Tim Hortons Gift Card", category: "Dining & Food Delivery", points: 50, redeemable: true, image: "https://m.media-amazon.com/images/I/41QqB1Q+9aL._SX522_.jpg" },
      { id: 3, name: "Hudson's Bay Gift Card", category: "Retail & Home Improvement", points: 150, redeemable: true, image: "https://www.paypalobjects.com/digitalassets/c/gifts/media/catalog/product/h/u/hudson_s_bay_gift_card_en_-_signature.png" },
      { id: 4, name: "Loblaws Gift Card", category: "Groceries & General", points: 200, redeemable: true, image: "https://www.grocerygiftcards.ca/img/01-gift-cards/loblaws.png" },
      { id: 5, name: "Air Canada Gift Card", category: "Travel & Transportation", points: 500, redeemable: true, image: "https://amaabcaprod.blob.core.windows.net/content/rewards/gift-cards/AirCanadaGiftCard.png" },
      { id: 6, name: "Best Buy Gift Card", category: "Electronics & Entertainment", points: 300, redeemable: true, image: "https://m.media-amazon.com/images/I/312x7UpempL.jpg" },
      { id: 7, name: "Sport Chek Gift Card", category: "Retail & Home Improvement", points: 120, redeemable: true, image: "https://assetscontent.s3.ca-central-1.amazonaws.com/images/1623867491334-CE00508C.jpg" },
      { id: 8, name: "Chapters Gift Card", category: "Retail & Home Improvement", points: 75, redeemable: true, image: "https://brand-lib.mygiftcardsplus.ca/brand/image/15336-69956-b15127ec-0e2d-4b5d-af0d-48f4a5e8a2b2/image_giftcard_300x190/chapters.png?t=1563550342" },
      { id: 9, name: "SkipTheDishes Gift Card", category: "Dining & Food Delivery", points: 100, redeemable: true, image: "https://m.media-amazon.com/images/I/31+36F4G4xL.jpg" },
      { id: 10, name: "Shoppers Drug Mart Gift Card", category: "Health, Beauty & Wellness", points: 130, redeemable: true, image: "https://assetscontent.s3.ca-central-1.amazonaws.com/images/1623674755699-ATB_Shoppers.jpg" },
      { id: 11, name: "Starbucks Gift Card", category: "Dining & Food Delivery", points: 60, redeemable: true, image: "https://globalassets.starbucks.com/digitalassets/cards/fy20/BrailleFY20.jpg" },
      { id: 12, name: "WestJet Gift Card", category: "Travel & Transportation", points: 450, redeemable: true, image: "https://pics.paypal.com/00/c/gifts/ca/westjet.png" },
      { id: 13, name: "Cineplex Gift Card", category: "Electronics & Entertainment", points: 80, redeemabletrue: true, image: "https://m.media-amazon.com/images/I/41XdPc5P0bL._SY400_.jpg" },
      { id: 14, name: "Sobeys Gift Card", category: "Groceries & General", points: 220, redeemable: true, image: "https://brand-lib.mygiftcardsplus.ca/brand/image/15856-72820-89c73ce0-e0ff-4c61-8d15-944669eb660b/image_giftcard_300x190/sobeys.png?t=1657653378" },
      { id: 15, name: "Uber Gift Card", category: "Travel & Transportation", points: 110, redeemable: true, image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1666820385/assets/4b/c7a2f9-d364-475c-b2e8-eff1c74ead56/original/Rides-gift-card.png" },
      { id: 16, name: "LCBO Gift Card", category: "Beverages", points: 150, redeemable: true, image: "https://m.media-amazon.com/images/I/31KCnFSZjOL.jpg" },
      { id: 17, name: "Amazon.ca Gift Card", category: "Retail & Home Improvement", points: 200, redeemable: true, image: "https://assetscontent.s3.ca-central-1.amazonaws.com/images/1637860998586-0320-0569.JPG" },
      { id: 18, name: "Petro-Canada Gift Card", category: "Travel & Transportation", points: 100, redeemable: true, image: "https://www.accolad.com/cdn/shop/files/Card_Template_1600x1056-petro-canada_1200x600_crop_center.jpg?v=1712607845" },
      { id: 19, name: "Pizza Pizza Gift Card", category: "Dining & Food Delivery", points: 70, redeemable: true, image: "https://ezgiftcards.ca/wp-content/uploads/2024/02/Pizza-Pizza-Gift-Card-Square.png" },
      { id: 20, name: "RONA Gift Card", category: "Retail & Home Improvement", points: 175, redeemable: true, image: "https://cdn.rona.ca/images/20625088_L.jpg" },
      { id: 21, name: "The Keg Gift Card", category: "Dining & Food Delivery", points: 150, redeemable: true, image: "https://m.media-amazon.com/images/I/41gbpkOxF1L.jpg" },
      { id: 22, name: "WaySpa Gift Card", category: "Health, Beauty & Wellness", points: 180, redeemable: true, image: "https://www.wayspa.com/wp-content/uploads/2019/10/WaySpa-Gift-Card.png" },
      { id: 23, name: "Costco Gift Card", category: "Groceries & General", points: 250, redeemable: true, image: "https://i.ebayimg.com/images/g/YNAAAOSw7oRlBOun/s-l1200.jpg" },
      { id: 24, name: "Apple Gift Card", category: "Electronics & Entertainment", points: 300, redeemable: true, image: "https://cdsassets.apple.com/live/7WUAS350/images/gifting/gift-cards-and-certificates/gift-cards-app-store-itunes.png" },
      { id: 25, name: "Netflix Gift Card", category: "Electronics & Entertainment", points: 100, redeemable: true, image: "https://mobileleb.com/cdn/shop/products/netflix-video-streaming-services-netflix-gift-card-36-usd-usa-28671616909444_1200x1200.jpg?v=1666065973" },
      { id: 26, name: "Sephora Gift Card", category: "Health, Beauty & Wellness", points: 125, redeemable: true, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDgs6ERRZXDcbYE240mUzoz4fZMUZAWfAaRA&s" },
      { id: 27, name: "Prepaid Visa Gift Card", category: "Groceries & General", points: 500, redeemable: true, image: "https://www.giftcardgranny.com/_next/image/?url=https%3A%2F%2Fres.cloudinary.com%2Fgift-card-granny%2Fimage%2Fupload%2Ff_auto%2Cw_300%2Fv1734704095%2FGCG%2Fassets%2Fq0mfv7tqalfe4qztonzf&w=640&q=75" },
      { id: 28, name: "IKEA \n\t Gift Card", category: "Retail & Home Improvement", points: 200, redeemable: true, image: "https://res.cloudinary.com/gift-card-granny/image/upload/f_auto/ar_79:50,c_scale,w_237/v1/GCG/merchants/ikea-gift-card?_a=AAADKDP" },
      { id: 29, name: "Golf Town Gift Card", category: "Retail & Home Improvement", points: 170, redeemable: true, image: "https://assetscontent.s3.ca-central-1.amazonaws.com/images/1623862566334-CE00413C.jpg" },
      { id: 30, name: "Boston Pizza Gift Card", category: "Dining & Food Delivery", points: 80, redeemable: true, image: "https://m.media-amazon.com/images/I/41yZXLyzuKL._SY400_.jpg" },
    ];

    const cartTotal = cart.reduce((sum, item) => sum + item.points * (item.quantity || 1), 0);

    const filteredGiftCards = giftCards
      .filter((card) => (category === "All" ? true : card.category === category))
      .filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((card) => (redeemableOnly ? card.redeemable : true))
      .sort((a, b) => (sortOrder === "Low" ? a.points - b.points : b.points - a.points));

      const handleAddToCart = (card) => {
        if (card.redeemable) {
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
        } else {
          alert('This gift card is not redeemable.');
        }
      };
      

      const handleRemoveFromCart = (cardId) => {
        setCart(cart.map(item => 
          item.id === cardId
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        ).filter(item => item.id !== cardId || item.quantity > 0));
      };
      
      const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
    // Cart component
    const Cart = () => (
      <div className={`cart-sidebar ${isCartMinimized ? 'minimized' : ''}`}
          style={{ right: isCartOpen ? '0' : '-400px' }}>
<div className="cart-header">
  {!isCartMinimized && <h2>Your Cart ({cartItemCount})</h2>}
  <div>
            <button className="cart-button" onClick={() => setIsCartMinimized(!isCartMinimized)}>
              {isCartMinimized ? '↔️' : '⬅️'}
            </button>
            <button className="cart-button" onClick={() => setIsCartOpen(false)}>×</button>
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
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.name} x{item.quantity}</h4>
                      <p>{item.points * item.quantity} pts</p>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                    {item.quantity > 1}
                  </div>
                ))}


                <div className="cart-total">
                  <h3>Total: {cartTotal} pts</h3>
                  <Link to="/checkout">
                    <button className="checkout-button">Proceed to Checkout ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</button>
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
        <div className="filters-sidebar">
          <h2>Filters</h2>
          
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

        <div className="gift-cards-grid">
  {filteredGiftCards.map((card) => (
    <div key={card.id} className="gift-card">
      <img src={card.image} alt={card.name} className="gift-card-image" />
      <h3>{card.name}</h3>
      <p>{card.points} pts</p>
      <button onClick={() => handleAddToCart(card)}>Add to Cart</button>
    </div>
  ))}
</div>


        <Cart />
      </div>
    );
  };

  export default Rewards;