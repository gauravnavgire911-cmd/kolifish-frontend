// src/pages/CheckoutPage.jsx (or src/components/Checkout.jsx - choose one)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutPage = () => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage (adjust as per your cart implementation)
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, []);

  // Load user data if logged in
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const user = res.data.user;
          setCustomer({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.addresses?.[0]?.street || '',
            city: user.addresses?.[0]?.city || '',
            state: user.addresses?.[0]?.state || '',
            pincode: user.addresses?.[0]?.pincode || ''
          });
        } catch (err) {
          console.log('Could not load user data');
        }
      }
    };
    loadUserData();
  }, []);

  // ============================================
  // COD ORDER SUBMIT
  // ============================================
  const handleCODOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        customer,
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        paymentMethod: 'cod'
      };

      const token = localStorage.getItem('token');
      const res = await axios.post('/api/orders', orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data.success) {
        alert('Order placed successfully! Order ID: ' + res.data.order._id);
        localStorage.removeItem('cart');
        window.location.href = '/order-success/' + res.data.order._id;
      }
    } catch (error) {
      alert('Order failed: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RAZORPAY PAYMENT
  // ============================================
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // 1. Create order on server
      const orderRes = await axios.post(
        '/api/payment/create-order',
        {
          amount: totalPrice,
          customer,
          items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const { razorpayOrder, orderId } = orderRes.data;

      // 2. Get Razorpay key
      const keyRes = await axios.get('/api/payment/key');
      const key = keyRes.data.key;

      // 3. Load Razorpay
      await loadRazorpay();

      // 4. Open checkout
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'KoliFish',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              '/api/payment/verify',
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId
              },
              { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );

            if (verifyRes.data.success) {
              alert('Payment successful! Order ID: ' + orderId);
              localStorage.removeItem('cart');
              window.location.href = '/order-success/' + orderId;
            }
          } catch (error) {
            alert('Payment verification failed!');
            console.error(error);
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        theme: {
          color: '#0066cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      alert('Payment failed: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FORM SUBMIT
  // ============================================
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'cod') {
      handleCODOrder();
    } else if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      alert('Please select a payment method');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>🛒 Checkout</h2>
      
      {/* Order Summary */}
      <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px' }}>
        <h3>Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit}>
        <h3>Delivery Details</h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          <input
            type="text"
            placeholder="Full Name *"
            value={customer.name}
            onChange={(e) => setCustomer({...customer, name: e.target.value})}
            required
            style={{ padding: '10px', width: '100%' }}
          />
          
          <input
            type="email"
            placeholder="Email *"
            value={customer.email}
            onChange={(e) => setCustomer({...customer, email: e.target.value})}
            required
            style={{ padding: '10px', width: '100%' }}
          />
          
          <input
            type="tel"
            placeholder="Phone *"
            value={customer.phone}
            onChange={(e) => setCustomer({...customer, phone: e.target.value})}
            required
            style={{ padding: '10px', width: '100%' }}
          />
          
          <input
            type="text"
            placeholder="Address *"
            value={customer.address}
            onChange={(e) => setCustomer({...customer, address: e.target.value})}
            required
            style={{ padding: '10px', width: '100%' }}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              placeholder="City *"
              value={customer.city}
              onChange={(e) => setCustomer({...customer, city: e.target.value})}
              required
              style={{ padding: '10px' }}
            />
            
            <input
              type="text"
              placeholder="State"
              value={customer.state}
              onChange={(e) => setCustomer({...customer, state: e.target.value})}
              style={{ padding: '10px' }}
            />
          </div>
          
          <input
            type="text"
            placeholder="Pincode *"
            value={customer.pincode}
            onChange={(e) => setCustomer({...customer, pincode: e.target.value})}
            required
            style={{ padding: '10px', width: '100%' }}
          />
        </div>

        {/* Payment Method Selection */}
        <h3 style={{ marginTop: '20px' }}>Payment Method</h3>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            💵 Cash on Delivery
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            💳 Razorpay (Card/UPI)
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || cartItems.length === 0}
          style={{
            width: '100%',
            padding: '15px',
            background: loading ? '#ccc' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now with Razorpay'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;