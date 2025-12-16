import React, { useState } from "react";
import api from "../../components/axiosInstance";
import "./pinModal.css";

const PinModal = ({ onClose, onSuccess }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/card-details", { cardPin: pin });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-modal-overlay">
      <div className="pin-modal-box">
        <h3>Enter Card PIN</h3>
        <p>Enter your 4-digit PIN to view card details</p>

        <input
          type="password"
          maxLength="4"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="pin-input"
        />

        {error && <p className="error">{error}</p>}

        <div className="pin-actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="verify" onClick={handleVerify} disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
