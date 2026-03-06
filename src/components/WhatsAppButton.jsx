import React from "react";

const PHONE = "8600010944";

export default function WhatsAppButton() {
  const link = `https://wa.me/91${PHONE}?text=Hi KoliFish! I want to order fresh fish`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "#25D366",
        color: "white",
        padding: "12px 18px",
        borderRadius: "40px",
        fontWeight: "bold",
        textDecoration: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      WhatsApp Order
    </a>
  );
}