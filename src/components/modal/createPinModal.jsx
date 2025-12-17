import React, { useState, useEffect } from "react";
import api from "../../components/axiosInstance";
import "./createPinModal.css";

const CreatePinModal = ({ isOpen, onClose = () => {}, onSuccess = () => {} }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setConfirmPin("");
      setMessage({ text: "", type: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 4 || confirmPin.length !== 4) {
      return setMessage({
        text: "PIN must be exactly 4 digits",
        type: "error",
      });
    }

    if (pin !== confirmPin) {
      return setMessage({
        text: "PINs do not match",
        type: "error",
      });
    }

    try {
      setLoading(true);
      setMessage({});

      const res = await api.post("/create-pin", { cardPin: pin });

      setMessage({
        text: res.data?.message || "PIN created successfully",
        type: "success",
      });

      onSuccess(res.data);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setMessage({
        text:
          err.response?.data?.message ||
          "Failed to create PIN",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="pin-modal-overlay"
      onClick={(e) =>
        e.target.classList.contains("pin-modal-overlay") && onClose()
      }
    >
      <div className="pin-modal">
        <h3>Create Transaction PIN</h3>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />

          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Confirm PIN"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
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
              {loading ? "Creating..." : "Create PIN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePinModal;
