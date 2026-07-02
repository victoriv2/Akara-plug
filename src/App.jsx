import React, { useState, useEffect } from 'react';
import { Phone, MapPin, ShoppingBag, CheckCircle, Utensils, Star, Quote } from 'lucide-react';
import locationData from './data/locations.json';
import './App.css';

function App() {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedLga, setSelectedLga] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [lgas, setLgas] = useState([]);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [isLgaModalOpen, setIsLgaModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const akaraSizes = [
    { id: 'small', name: 'Small Portion', price: 100, desc: 'Perfect for a quick bite' },
    { id: 'medium', name: 'Medium Portion', price: 200, desc: 'A satisfying meal' },
  ];

  const sides = [
    { id: 'bread', name: 'Fresh Bread', price: 150 },
    { id: 'pap', name: 'Hot Pap (Ogi)', price: 100 },
    { id: 'custard', name: 'Creamy Custard', price: 150 },
    { id: 'sauce', name: 'Pepper & Onion Sauce', price: 50 },
  ];

  useEffect(() => {
    if (selectedState) {
      const stateObj = locationData.find(s => s.state === selectedState);
      if (stateObj) {
        const sortedLgas = [...stateObj.lgas].sort((a, b) => a.localeCompare(b));
        setLgas(sortedLgas);
      } else {
        setLgas([]);
      }
      setSelectedLga('');
    }
  }, [selectedState]);

  const updateSideQuantity = (sideId, qty) => {
    setSelectedSides(prev => ({
      ...prev,
      [sideId]: Math.max(0, qty)
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedSize) {
      const sizeObj = akaraSizes.find(s => s.id === selectedSize);
      total += sizeObj.price * quantity;
    }
    
    sides.forEach(side => {
      const sideQty = selectedSides[side.id] || 0;
      total += side.price * sideQty;
    });
    
    return total;
  };

  const handleOrder = (e) => {
    e.preventDefault();
    if (!selectedSize || !selectedState || !selectedLga || !customerName || !address) {
      alert("Please fill in all details and select an Akara size.");
      return;
    }

    const sizeName = akaraSizes.find(s => s.id === selectedSize).name;
    const addedSides = sides.filter(s => selectedSides[s.id] > 0).map(s => `${selectedSides[s.id]}x ${s.name}`).join(', ');
    const total = calculateTotal();

    const rawMessage = `*New Order from Akara Plug!*

*Name:* ${customerName}
*Order:* ${quantity}x ${sizeName}
*Extras:* ${addedSides || 'None'}
*Total Price:* ₦${total}

*Delivery Details:*
*State:* ${selectedState}
*LGA:* ${selectedLga}
*Address:* ${address}

Please confirm my order.`;

    const whatsappUrl = `https://wa.me/2349031932413?text=${encodeURIComponent(rawMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo">
            <Utensils className="logo-icon" />
            <span>Akara Plug</span>
          </div>
          <a href="https://wa.me/2349031932413" target="_blank" rel="noreferrer" className="btn btn-outline">
            <Phone size={18} /> Contact Us
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container hero-container">
          <div className="hero-content animate-fade-up">
            <span className="badge">Hot & Freshly Fried 🔥</span>
            <h1>Authentic Nigerian Akara, Delivered to Your Doorstep.</h1>
            <p>Golden-brown, crispy on the outside, and fluffy inside. Pair it with soft bread, hot pap, or custard for the perfect meal.</p>
            <button className="btn btn-primary hero-btn" onClick={() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' })}>
              Order Now
            </button>
          </div>
          <div className="hero-image-wrapper animate-fade-up">
            <img src="/akara_hero.jpg" alt="Hot Akara" className="hero-image" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features bg-light">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <CheckCircle className="feature-icon" />
              <h3>Secret Recipe</h3>
              <p>Made with premium honey beans and a blend of authentic Nigerian spices.</p>
            </div>
            <div className="feature-card">
              <Utensils className="feature-icon" />
              <h3>Perfect Combos</h3>
              <p>Enjoy with freshly baked agege bread, pap, or creamy custard.</p>
            </div>
            <div className="feature-card">
              <MapPin className="feature-icon" />
              <h3>Nationwide Reach</h3>
              <p>We deliver across all 36 states and LGAs in Nigeria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="order-section container py-16">
        <div className="text-center mb-8">
          <h2>Place Your Order</h2>
          <p>Customize your Akara meal exactly how you like it.</p>
        </div>

        <form onSubmit={handleOrder} className="order-form">
          <div className="order-grid">
            {/* Step 1: Menu */}
            <div className="order-step">
              <h3 className="step-title">1. Choose Your Portion</h3>
              <div className="options-grid">
                {akaraSizes.map(size => (
                  <div 
                    key={size.id}
                    className={`option-card ${selectedSize === size.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    <h4>{size.name}</h4>
                    <p className="price">₦{size.price}</p>
                    <p className="desc">{size.desc}</p>
                  </div>
                ))}
              </div>

              <div className="quantity-wrapper mt-4">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button type="button" className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                  />
                  <button type="button" className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <h3 className="step-title mt-4">2. Add Extras & Sides</h3>
              <div className="sides-grid">
                {sides.map(side => {
                  const sideQty = selectedSides[side.id] || 0;
                  return (
                    <div key={side.id} className="side-card">
                      <div className="side-info">
                        <span>{side.name}</span>
                        <span className="side-price">(+₦{side.price})</span>
                      </div>
                      <div className="quantity-controls side-qty">
                        <button type="button" className="qty-btn" onClick={(e) => { e.preventDefault(); updateSideQuantity(side.id, sideQty - 1); }}>-</button>
                        <span>{sideQty}</span>
                        <button type="button" className="qty-btn" onClick={(e) => { e.preventDefault(); updateSideQuantity(side.id, sideQty + 1); }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="order-step form-details">
              <h3 className="step-title">3. Delivery Details</h3>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <button 
                  type="button" 
                  className="btn btn-outline w-100 modal-trigger-btn"
                  onClick={() => { setIsStateModalOpen(true); setSearchQuery(''); }}
                >
                  {selectedState || "Select State"}
                </button>
              </div>

              <div className="form-group">
                <label>Local Government Area</label>
                <button 
                  type="button" 
                  className="btn btn-outline w-100 modal-trigger-btn"
                  onClick={() => { setIsLgaModalOpen(true); setSearchQuery(''); }}
                  disabled={!selectedState}
                >
                  {selectedLga || "Select LGA"}
                </button>
              </div>

              <div className="form-group">
                <label>Detailed Address</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Street, House No, etc."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Order Summary */}
              <div className="order-summary mt-4">
                <h4>Total Estimated Price</h4>
                <div className="total-price">₦{calculateTotal()}</div>
                <p className="summary-note">Payment will be confirmed on WhatsApp.</p>
                
                <button type="submit" className="btn btn-primary w-100 checkout-btn">
                  <ShoppingBag size={20} /> Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Testimonials */}
      <section className="testimonials bg-light py-16">
        <div className="container">
          <h2 className="text-center mb-8">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <Quote className="quote-icon" />
              <p>"The best Akara I've ever had! It arrived hot, and the pepper sauce is just phenomenal."</p>
              <div className="customer-info">
                <strong>Chidi O.</strong>
                <div className="stars"><Star size={16} fill="var(--primary)" color="var(--primary)"/></div>
              </div>
            </div>
            <div className="testimonial-card">
              <Quote className="quote-icon" />
              <p>"Akara Plug is a lifesaver for Saturday mornings. Their Akara and Pap combo is top-notch!"</p>
              <div className="customer-info">
                <strong>Aisha M.</strong>
                <div className="stars"><Star size={16} fill="var(--primary)" color="var(--primary)"/></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center">
        <div className="container">
          <div className="footer-logo">
            <Utensils /> <span>Akara Plug</span>
          </div>
          <p>© {new Date().getFullYear()} Akara Plug. All rights reserved.</p>
          <p>Contact: <a href="https://wa.me/2349031932413">09031932413</a></p>
        </div>
      </footer>

      {/* Modals */}
      {isStateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Select State</h3>
            <input 
              type="text" 
              placeholder="Search states..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modal-search"
            />
            <div className="modal-list">
              {[...locationData]
                .sort((a, b) => a.state.localeCompare(b.state))
                .filter(loc => loc.state.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(loc => (
                  <button 
                    key={loc.state} 
                    className="modal-list-item"
                    onClick={() => { setSelectedState(loc.state); setIsStateModalOpen(false); }}
                  >
                    {loc.state}
                  </button>
              ))}
            </div>
            <button type="button" className="btn btn-outline w-100 mt-4" onClick={() => setIsStateModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {isLgaModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLgaModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Select LGA in {selectedState}</h3>
            <input 
              type="text" 
              placeholder="Search LGAs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modal-search"
            />
            <div className="modal-list">
              {lgas
                .filter(lga => lga.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(lga => (
                  <button 
                    key={lga} 
                    className="modal-list-item"
                    onClick={() => { setSelectedLga(lga); setIsLgaModalOpen(false); }}
                  >
                    {lga}
                  </button>
              ))}
            </div>
            <button type="button" className="btn btn-outline w-100 mt-4" onClick={() => setIsLgaModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
