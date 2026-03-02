import React from 'react';

const Contact = () => (
  <div style={{ padding: '20px' }}>
    <h2>Contact Us</h2>
    <p>Email: info@kolifish.com</p>
    <p>Phone: +91-1234567890</p>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153168!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1f9c7c9b1e!2sMelbourne%20CBD%2C%20Victoria%2C%20Australia!5e0!3m2!1sen!2sus!4v1633072800000!5m2!1sen!2sus"
      width="600"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      title="Location"
    ></iframe>
  </div>
);

export default Contact;