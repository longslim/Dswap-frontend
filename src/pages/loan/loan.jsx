import React, { useEffect, useState } from "react";
import api from "../../components/axiosInstance";
import "./loan.css";

const Loan = () => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [sendingTx, setSendingTx] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchUserLoan();
  }, []);

  const fetchUserLoan = async () => {
    try {
      const res = await api.get("/loan-status");
      setLoan(res.data.loan);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApply = async () => {
    if (!amount || !duration) {
      setMessage({ text: "Please fill all fields", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/apply", {
        amount,
        durationMonths: duration,
      });

      setLoan(res.data.loan);
      setMessage({ text: "Loan request submitted", type: "success" });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setMessage({ text: "Failed to apply for loan", type: "error" });
      setLoading(false);
    }
  };

  const submitBtcProof = async () => {
    if (!txHash.trim()) {
      setMessage({ text: "Enter a valid BTC transaction hash", type: "error" });
      return;
    }

    try {
      setSendingTx(true);

      await api.post(`/${loan._id}/submit-btc-proof`, { txHash });

      setTxHash(""); 
      setMessage({ text: "BTC proof submitted", type: "success" });

      fetchUserLoan();

      setSendingTx(false);
    } catch (err) {
      console.log(err);
      setMessage({ text: "Error submitting proof", type: "error" });
      setSendingTx(false);
    }
  };
  

  return (
    <div className="loan-container">
      <h2>💰 Apply for Loan</h2>

      {message.text && (
        <div className={`msg-box ${message.type}`}>
          {message.text}
        </div>
      )}

      {!loan && (
        <div className="loan-form">
          <input
            type="number"
            placeholder="Loan Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="">Select Duration</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>

          <button onClick={handleApply} disabled={loading}>
            {loading ? "Submitting..." : "Apply Now"}
          </button>
        </div>
      )}

      {loan && (
        <div className="loan-status-box">
          <h3>📌 Loan Status: {loan.status.toUpperCase()}</h3>

          <p><strong>Loan Amount:</strong> ${loan.amount}</p>
          <p><strong>Duration:</strong> {loan.durationMonths} months</p>
          <p><strong>Total Repayable:</strong> ${loan.totalRepayable}</p>
          <p><strong>Monthly Payment:</strong> ${loan.monthlyPayment}</p>

          <hr />

          {loan.status === "awaiting-btc" && (
            <div className="btc-box">
              <h4>🔐 BTC Payment Required</h4>

              <div className="copy-row">
                <code>{loan.btcAddress}</code>
                <button onClick={() => navigator.clipboard.writeText(loan.btcAddress)}>
                  Copy
                </button>
              </div>

              <p><strong>Amount Required:</strong> ${loan.btcAmountRequired} (BTC)</p>

              <h4>Enter BTC Transaction Hash</h4>
              <input
                type="text"
                placeholder="Enter BTC Tx Hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />

              <button onClick={submitBtcProof} disabled={sendingTx}>
                {sendingTx ? "Submitting..." : "Submit Proof"}
              </button>
            </div>
          )}

          {loan.status === "processing" && (
            <p className="processing">⏳ Awaiting BTC Verification...</p>
          )}

          {loan.status === "approved" && (
            <p className="approved">🎉 Loan Approved! Funds Credited</p>
          )}

          {loan.status === "rejected" && (
            <p className="rejected">❌ Loan Rejected</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Loan;
