import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(product).forEach(key =>
        formData.append(key, product[key])
      );

      const res = await axios.post('/api/admin/product', formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Product added successfully!');
      console.log(res.data);

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="admin">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={e =>
            setProduct(prev => ({ ...prev, name: e.target.value }))
          }
          required
        />

        <input
          type="file"
          onChange={e =>
            setProduct(prev => ({ ...prev, image: e.target.files[0] }))
          }
          required
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminDashboard;