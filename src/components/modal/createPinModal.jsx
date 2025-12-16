import React, { useState, useEffect } from "react";
import api from "../../components/axiosInstance";
import "./createPinModal.css";

const NUMPAD = [
  ["1","2","3"],
  ["4","5","6"],
  ["7","8","9"],
  ["back","0","clear"]
];

const CreatePinModal = ({ isOpen, onClose = () => {}, onSuccess = () => {} }) => {
  const [activeField, setActiveField] = useState("pin"); // "pin" or "confirm"
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!isOpen) {
    
      setPin("");
      setConfirmPin("");
      setActiveField("pin");
      setMessage({ text: "", type: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNumpad = (key) => {
    setMessage({ text: "", type: "" });

    const setter = activeField === "pin" ? setPin : setConfirmPin;
    const value = activeField === "pin" ? pin : confirmPin;

    if (key === "clear") {
      setter("");
      return;
    }
    if (key === "back") {
      setter(value.slice(0, -1));
      return;
    }
    if (value.length >= 4) return; // limit to 4 digits

    // only numeric keys reach here
    setter(value + key);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (pin.length !== 4 || confirmPin.length !== 4) {
      return setMessage({ text: "Both PINs must be 4 digits", type: "error" });
    }
    if (pin !== confirmPin) {
      return setMessage({ text: "PINs do not match", type: "error" });
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await api.post("/create-pin", { cardPin: pin });
      setMessage({ text: res.data?.message || "PIN created", type: "success" });
      onSuccess(res.data);
      // close after short delay so user sees feedback
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to create PIN",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-overlay" onMouseDown={(e) => { if (e.target.classList.contains("cp-overlay")) onClose(); }}>
      <div className="cp-sheet" role="dialog" aria-modal="true">
        <div className="cp-header">
          <h3>Create Card PIN</h3>
          <button className="cp-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="cp-sub">This PIN will be used to view your full card details.</p>

        <form className="cp-form" onSubmit={handleSubmit} onKeyDown={(e) => e.preventDefault()}>
          <div className="cp-fields">
            <div
              className={`cp-field ${activeField === "pin" ? "active" : ""}`}
              onClick={() => setActiveField("pin")}
            >
              <label>Enter PIN</label>
              <div className="cp-digits">
                {[0,1,2,3].map(i => (
                  <span key={i} className={`digit ${pin[i] ? "filled" : ""}`}>{pin[i] ? "•" : ""}</span>
                ))}
              </div>
            </div>

            <div
              className={`cp-field ${activeField === "confirm" ? "active" : ""}`}
              onClick={() => setActiveField("confirm")}
            >
              <label>Confirm PIN</label>
              <div className="cp-digits">
                {[0,1,2,3].map(i => (
                  <span key={i} className={`digit ${confirmPin[i] ? "filled" : ""}`}>{confirmPin[i] ? "•" : ""}</span>
                ))}
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`cp-message ${message.type === "error" ? "error" : "success"}`}>
              {message.text}
            </div>
          )}

          <div className="cp-numpad" onKeyDown={(e) => e.preventDefault()}>
            {NUMPAD.map((row, rIdx) => (
              <div className="nrow" key={rIdx}>
                {row.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`nkey ${k === "back" ? "back" : ""} ${k === "clear" ? "clear" : ""}`}
                    onClick={() => handleNumpad(k)}
                    aria-label={k}
                  >
                    {k === "back" ? "⌫" : k === "clear" ? "Clear" : k}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="cp-actions">
            <button type="button" className="cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="submit" disabled={loading}>
              {loading ? "Creating..." : "Create PIN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePinModal;
