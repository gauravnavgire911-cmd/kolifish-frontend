import React, { useState } from 'react';
import axios from 'axios';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);

  const trackOrder = async () => {
    const res = await axios.get(`/api/orders/${orderId}`);
    setOrder(res.data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Track Your Order</h2>
      <input placeholder="Enter Order ID" onChange={(e) => setOrderId(e.target.value)} />
      <button onClick={trackOrder}>Track</button>
      {order && <p>Status: {order.status}</p>}
    </div>
  );
};

export default OrderTracking;