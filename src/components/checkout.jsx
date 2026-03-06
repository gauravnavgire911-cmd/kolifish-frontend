import React, { useState } from "react";

const Checkout = ({ onSubmit }) => {
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!details.name.trim()) return "Please enter your name";

    if (!/^[6-9]\d{9}$/.test(details.phone))
      return "Enter a valid 10 digit phone number";

    if (!details.address.trim()) return "Please enter your address";

    if (!/^\d{6}$/.test(details.pincode))
      return "Enter a valid 6 digit pincode";

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (typeof onSubmit === "function") {
      onSubmit(details);
    }

    setDetails({
      name: "",
      phone: "",
      address: "",
      landmark: "",
      pincode: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Delivery Details</h2>

      {error && <div style={styles.error}>{error}</div>}

      <input
        name="name"
        placeholder="Full Name"
        value={details.name}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={details.phone}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <textarea
        name="address"
        placeholder="Full Address"
        value={details.address}
        onChange={handleChange}
        style={styles.textarea}
        required
      />

      <input
        name="landmark"
        placeholder="Landmark (optional)"
        value={details.landmark}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="pincode"
        placeholder="Pincode"
        value={details.pincode}
        onChange={handleChange}
        style={styles.input}
        required
      />

      <button type="submit" style={styles.button}>
        Place Order
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "420px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
  },

  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    minHeight: "70px",
  },

  button: {
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "5px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px",
    borderRadius: "6px",
    fontSize: "13px",
  },
};

export default Checkout;