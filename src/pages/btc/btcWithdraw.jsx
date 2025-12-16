import React, { useEffect, useState } from "react";
import api from "../../components/axiosInstance";
import "./btcWithdraw.css";
import ConfirmModal from "../../components/modal/confirmModal";
import ResultModal from "../../components/modal/resultModal";

const BtcWithdraw = () => {
  const [btcBalance, setBtcBalance] = useState(0);
  const [usdEquivalent, setUsdEquivalent] = useState(0);
  const [btcAmount, setBtcAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [displayUsdValue, setDisplayUsdValue] = useState("0.00");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [price, setPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [inputMode, setInputMode] = useState("BTC");

  // 🔥 NEW STATES FOR MODALS
  const [showModal, setShowModal] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState("success");
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/balances");
        setBtcBalance(Number(res.data.balances?.btc || 0));
      } catch (err) {}
    })();

    (async () => {
      try {
        const res = await api.get("/price");
        setPrice(Number(res.data?.bitcoin?.usd || 0));
      } catch (err) {}
    })();
  }, []);

  useEffect(() => {
    setUsdEquivalent(Number(btcBalance) * Number(price || 0));
  }, [btcBalance, price]);

  useEffect(() => {
    const btcNum = btcAmount === "" ? 0 : Number(btcAmount);
    const usd = btcNum * (Number(price) || 0);

    let rate = 0;
    if (usd < 100) rate = 0.05;
    else if (usd < 1000) rate = 0.1;
    else rate = 0.15;

    const feeBTC = +(btcNum * rate);
    const netBTC = +(btcNum - feeBTC);

    setFee(Number.isFinite(feeBTC) ? Number(feeBTC) : 0);
    setNetAmount(Number.isFinite(netBTC) ? Number(netBTC) : 0);
    setDisplayUsdValue((Number(netBTC) * Number(price || 0)).toFixed(2));

    if (inputMode === "BTC") {
      setUsdAmount(usd && Number.isFinite(usd) ? usd.toFixed(2) : "");
    }
  }, [btcAmount, price, inputMode]);

  const handleBTCChange = (e) => {
    const v = e.target.value;
    if (/^\d*\.?\d*$/.test(v)) {
      setBtcAmount(v);
      setInputMode("BTC");
    }
  };

  const handleUSDChange = (e) => {
    let v = e.target.value;
    setUsdAmount(v);

    if (v === "") {
      setBtcAmount("");
      return;
    }

    if (!/^\d+$/.test(v)) return;

    const usdInt = parseInt(v, 10);
    if (!price || price === 0) {
      setBtcAmount("");
    } else {
      setBtcAmount((usdInt / Number(price)).toFixed(8));
    }

    setInputMode("USD");
  };

  // 🔥 Handle "Submit Withdrawal" → open modal instead of sending request
  const submit = () => {
    const btcNum = btcAmount === "" ? 0 : Number(btcAmount);

    if (!btcNum || btcNum <= 0) {
      setMessage("Enter a valid BTC amount to withdraw.");
      return;
    }
    if (!destinationAddress) {
      setMessage("Enter destination BTC address.");
      return;
    }
    if (btcNum > (btcBalance || 0)) {
      setMessage("Insufficient BTC balance.");
      return;
    }

    setShowModal(true);
  };

  // 🔥 Handle Confirm Modal Submission
  const handleConfirmTransfer = async () => {
    setLoading(true);

    try {
      await api.post("/request-withdraw", {
        btcAmount: Number(btcAmount),
        destinationAddress,
      });

      setShowModal(false);

      setResultType("success");
      setResultMessage("Withdrawal submitted successfully.");
      setResultOpen(true);

      setBtcAmount("");
      setUsdAmount("");
      setDestinationAddress("");

      const res = await api.get("/balances");
      setBtcBalance(Number(res.data.balances?.btc || 0));
    } catch (err) {
      setShowModal(false);
      setResultType("error");
      setResultMessage(err.response?.data?.message || "Error processing withdrawal.");
      setResultOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdrawContainer">
      <h2>Withdraw Bitcoin</h2>

      <p><span>Your BTC Balance:</span> <strong className="value">{(Number(btcBalance) || 0).toFixed(8)} BTC</strong></p>
      <p><span>USD Equivalent:</span> <strong className="value">${usdEquivalent.toLocaleString(undefined,{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>

      <div className="currency-switch">
        <button
          className={inputMode === "BTC" ? "active" : ""}
          onClick={() => {
            if (inputMode === "USD") {
              const usdVal = usdAmount === "" ? 0 : Number(usdAmount);
              if (price > 0) {
                setBtcAmount((usdVal / price).toFixed(8));
              }
            }
            setInputMode("BTC");
          }}
        >
          ₿
        </button>

        <span className="switch-arrow">⇄</span>

        <button
          className={inputMode === "USD" ? "active" : ""}
          onClick={() => {
            if (inputMode === "BTC") {
              const btcVal = btcAmount === "" ? 0 : Number(btcAmount);
              setUsdAmount(price ? (btcVal * price).toFixed(2) : "");
            }
            setInputMode("USD");
          }}
        >
          $
        </button>
      </div>

      {inputMode === "BTC" && (
        <div>
          <label>Amount (BTC)</label>
          <input
            type="text"
            inputMode="decimal"
            value={btcAmount}
            onChange={handleBTCChange}
            placeholder="0.00000000"
          />
        </div>
      )}

      {inputMode === "USD" && (
        <div>
          <label>Amount (USD)</label>
          <input
            type="text"
            inputMode="numeric"
            value={usdAmount}
            onChange={handleUSDChange}
            placeholder="Enter USD amount"
          />
        </div>
      )}

      <div>
        <label>Destination BTC Address</label>
        <input
          type="text"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
        />
      </div>

      <div>
        <p>Fee: {Number(fee).toFixed(8)} BTC</p>
        <p>Net BTC Sent: {Number(netAmount).toFixed(8)}</p>
        <p>USD Value: ${displayUsdValue}</p>
      </div>

      <button onClick={submit}>Submit Withdrawal</button>

      {/* 🔥 Confirm Modal */}
      <ConfirmModal
        isOpen={showModal}
        title="Confirm Withdrawal"
        message={`Send ${(btcAmount || 0)} BTC to address:\n${destinationAddress}?`}
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

      {message && <p>{message}</p>}
    </div>
  );
};

export default BtcWithdraw;
