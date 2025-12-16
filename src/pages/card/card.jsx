import React, { useEffect, useState } from "react";
import api from "../../components/axiosInstance";
import "./card.css";
import PinModal from "../../components/modal/pinModal";

const Card = () => {
  const [maskedCard, setMaskedCard] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [fullDetails, setFullDetails] = useState(null);

  useEffect(() => {
    fetchMaskedCard();
  }, []);

  const fetchMaskedCard = async () => {
    try {
      const res = await api.get("/masked");
      setMaskedCard(res.data.cardNumber);
    } catch (err) {
      console.log("Error fetching card", err);
    }
  };

  return (
    <div className="card-page">

      {/* CARD UI */}
      <div className="virtual-card">
        <h3>Card</h3>
        <p className="masked">{maskedCard}</p>

        <button className="show-btn" onClick={() => setShowPinModal(true)}>
          Show Details
        </button>
      </div>

      {/* PIN INPUT MODAL */}
      {showPinModal && (
        <PinModal
          onClose={() => setShowPinModal(false)}
          onSuccess={(details) => {
            setFullDetails(details);
            setShowPinModal(false);
          }}
        />
      )}

      {/* FULL DETAILS SECTION */}
      {fullDetails && (
        <div className="full-details-box">
        <h3>Card Details</h3>
      
        <div className="copy-row">
          <p><strong>Card Number:</strong> {fullDetails.cardNumber}</p>
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(fullDetails.cardNumber)}
          >
            Copy
          </button>
        </div>
      
        <div className="copy-row">
          <p><strong>CVV:</strong> {fullDetails.cvv}</p>
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(fullDetails.cvv)}
          >
            Copy
          </button>
        </div>
      
        <p><strong>Expiry:</strong> {fullDetails.expiryDate}</p>
      </div>
      
      )}

    </div>
  );
};

export default Card;
