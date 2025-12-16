import React, { useState } from 'react';
import "./btcPurchase.css";
import api from '../../components/axiosInstance';
import ConfirmModal from '../../components/modal/confirmModal';
import ResultModal from '../../components/modal/resultModal';

const BtcPurchase = () => {
  const [usdAmount, setUsdAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Modal States
  const [showModal, setShowModal] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState("success");
  const [resultMessage, setResultMessage] = useState("");

  // 🔥 Step 1: User clicks Buy → show confirm modal
  const handleBuyClick = () => {
    if (!usdAmount || Number(usdAmount) <= 0) {
      setResultType("error");
      setResultMessage("Enter a valid USD amount.");
      setResultOpen(true);
      return;
    }
    setShowModal(true);
  };

  // 🔥 Step 2: Confirm Purchase → Create Coinbase Charge
  const handleConfirmTransfer = async () => {
    setLoading(true);

    try {
      const res = await api.post("/buy-btc", { usdAmount });

      setShowModal(false);
      setLoading(false);

      // Redirect to Coinbase hosted checkout
      window.location.href = res.data.hosted_url;

    } catch (err) {
      console.error(err);

      setShowModal(false);
      setLoading(false);
      setResultType("error");
      setResultMessage("Cannot create purchase link.");
      setResultOpen(true);
    }
  };

  return (
    <div className="buyContainer">
      <h2>Purchase Bitcoin</h2>

      <input
        type="number"
        placeholder="Enter USD amount"
        value={usdAmount}
        onChange={(e) => setUsdAmount(e.target.value)}
      />

      <button disabled={loading} onClick={handleBuyClick}>
        {loading ? "Loading..." : "Buy BTC"}
      </button>

      {/* 🔥 Confirm Modal */}
      <ConfirmModal
        isOpen={showModal}
        title="Confirm Purchase"
        message={`Buy $${usdAmount} worth of Bitcoin?`}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        onConfirm={handleConfirmTransfer}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />

      {/* 🔥 Result Modal */}
      <ResultModal
        isOpen={resultOpen}
        type={resultType}
        title={resultType === "success" ? "Success!" : "Failed!"}
        message={resultMessage}
        onClose={() => setResultOpen(false)}
      />
    </div>
  );
};

export default BtcPurchase;
