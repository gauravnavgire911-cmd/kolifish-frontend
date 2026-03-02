// components/RazorpayCheckout.jsx
import { useState } from 'react';
import axios from 'axios';

const RazorpayCheckout = ({ orderData, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const load Razorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Get Razorpay key
      const keyRes = await axios.get('/api/payment/key');
      const key = keyRes.data.key;

      // 2. Create order on server
      const orderRes = await axios.post(
        '/api/payment/create-order',
        {
          amount: orderData.totalPrice,
          customer: orderData.customer,
          items: orderData.items
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const { razorpayOrder, orderId } = orderRes.data;

      // 3. Load Razorpay script
      await loadRazorpay();

      // 4. Open Razorpay checkout
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'KoliFish',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // 5. Verify payment on server
            const verifyRes = await axios.post(
              '/api/payment/verify',
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }
            );

            if (verifyRes.data.success) {
              onSuccess(verifyRes.data.order);
            }
          } catch (error) {
            alert('Payment verification failed!');
            console.error(error);
          }
        },
        prefill: {
          name: orderData.customer.name,
          email: orderData.customer.email || '',
          contact: orderData.customer.phone
        },
        theme: {
          color: '#0066cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      alert('Payment failed: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="pay-button"
      >
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
    </div>
  );
};

export default RazorpayCheckout;