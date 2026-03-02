import React, { useState } from 'react';

const Checkout = ({ onSubmit }) => {
  const [details, setDetails] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <input
        name="name"
        placeholder="Name"
        value={details.name}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={details.phone}
        onChange={handleChange}
        required
      />

      <input
        name="address"
        placeholder="Address"
        value={details.address}
        onChange={handleChange}
        required
      />

      <input
        name="pincode"
        placeholder="Pincode"
        value={details.pincode}
        onChange={handleChange}
        required
      />

      <button type="submit">Place Order</button>
    </form>
  );
};

export default Checkout;