import React from "react";
import { useCart } from "../context/CartContext.jsx";

const Cart = ({ isOpen, onClose }) => {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.cartContainer}>
        <div style={styles.cartHeader}>
          <h2>Your Cart</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        {cart.length === 0 ? (
          <div style={styles.emptyCart}>
            <p>Your cart is empty</p>
            <button onClick={onClose} style={styles.continueShopping}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div style={styles.cartItems}>
              {cart.map((item) => {
                const grams = Math.round(item.weightKg * 1000);

                return (
                  <div
                    key={`${item.productId}_${item.weightKg}`}
                    style={styles.cartItem}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.itemImage}
                    />

                    <div style={styles.itemDetails}>
                      <h3>{item.name}</h3>

                      <p style={styles.weight}>
                        {grams}g • ₹{item.pricePerKg}/kg
                      </p>

                      <div style={styles.quantityControl}>
                        <button
                          onClick={() =>
                            updateQty(
                              item.productId,
                              item.weightKg,
                              item.qty - 1
                            )
                          }
                          style={styles.quantityButton}
                        >
                          -
                        </button>

                        <span style={styles.quantity}>{item.qty}</span>

                        <button
                          onClick={() =>
                            updateQty(
                              item.productId,
                              item.weightKg,
                              item.qty + 1
                            )
                          }
                          style={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={styles.itemTotal}>
                      <p>₹{item.lineTotal}</p>

                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.weightKg)
                        }
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.cartFooter}>
              <div style={styles.total}>
                <h3>Total: ₹{cartTotal}</h3>
              </div>

              <button
                style={styles.checkoutButton}
                onClick={() => alert("Checkout coming soon")}
              >
                Proceed to Checkout
              </button>

              <button onClick={clearCart} style={styles.clearButton}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000,
  },

  cartContainer: {
    width: "420px",
    backgroundColor: "#fff",
    height: "100%",
    padding: "20px",
    overflowY: "auto",
    boxShadow: "-2px 0 10px rgba(0,0,0,0.15)",
  },

  cartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },

  closeButton: {
    fontSize: "26px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  emptyCart: {
    textAlign: "center",
    padding: "40px 0",
  },

  continueShopping: {
    padding: "10px 20px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },

  cartItems: {
    marginBottom: "20px",
  },

  cartItem: {
    display: "flex",
    padding: "15px 0",
    borderBottom: "1px solid #eee",
  },

  itemImage: {
    width: "65px",
    height: "65px",
    objectFit: "cover",
    borderRadius: "6px",
    marginRight: "15px",
  },

  itemDetails: {
    flex: 1,
  },

  weight: {
    fontSize: "13px",
    color: "#666",
  },

  quantityControl: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
  },

  quantityButton: {
    width: "30px",
    height: "30px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },

  quantity: {
    margin: "0 10px",
    fontWeight: "bold",
  },

  itemTotal: {
    textAlign: "right",
    marginLeft: "10px",
  },

  removeButton: {
    background: "none",
    border: "none",
    color: "red",
    cursor: "pointer",
    marginTop: "5px",
    fontSize: "12px",
  },

  cartFooter: {
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },

  total: {
    marginBottom: "15px",
    textAlign: "right",
  },

  checkoutButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "10px",
  },

  clearButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Cart;