import React, { useState } from "react";
import api from "../../components/axiosInstance";
import "./changePinModal.css";

const ChangePinModal = ({ isOpen, onClose }) => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPin.length !== 4) {
      return setMessage({
        type: "error",
        text: "New PIN must be exactly 4 digits",
      });
    }

    try {
      setLoading(true);
      setMessage({});

      const res = await api.put("/change-pin", {
        oldPin,
        newPin,
      });

      setMessage({
        type: "success",
        text: res.data.message || "PIN changed successfully",
      });

      setOldPin("");
      setNewPin("");

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to change PIN",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-modal-overlay">
      <div className="pin-modal">
        <h3>Change Transaction PIN</h3>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            maxLength="4"
            placeholder="Old PIN"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            required
          />

          <input
            type="password"
            inputMode="numeric"
            maxLength="4"
            placeholder="New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              className="cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Changing..." : "Change PIN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePinModal;
