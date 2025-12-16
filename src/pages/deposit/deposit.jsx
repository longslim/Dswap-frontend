import React, { useReducer, useState } from "react";
import "./deposit.css";
import api from "../../components/axiosInstance";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "CARDNUMBER":
      return { ...state, cardNumber: action.payload };
    case "CVV":
      return { ...state, cvv: action.payload };
    case "EXPIRYDATE":
      return { ...state, expiryDate: action.payload };
    case "AMOUNT":
      return { ...state, amount: action.payload };
    case "CARDPIN":
      return { ...state, cardPin: action.payload };
    case "FRONTCHEQUE":
      return { ...state, frontCheque: action.payload };
    case "BACKCHEQUE":
      return { ...state, backCheque: action.payload };
    default:
      return state;
  }
};

const Deposit = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    cardNumber: "",
    cvv: "",
    expiryDate: "",
    amount: "",
    cardPin: "",
    frontCheque: null,
    backCheque: null,
  });

  // 🏦 Card Deposit Handler
  const handleCardDeposit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const { cardNumber, cvv, expiryDate, amount, cardPin } = state;
      if (!cardNumber || !cvv || !expiryDate || !amount || !cardPin) {
        setMessage({ text: "All card fields are required", type: "error" });
        return;
      }

      const res = await api.post("/card-deposit", {
        cardNumber,
        cvv,
        expiryDate,
        amount,
        cardPin,
      });

      if (res.data.success) {
        setMessage({ text: "Card deposit successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({ text: "Deposit failed", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Server error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Cheque Deposit Handler
  const handleChequeDeposit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const { frontCheque, backCheque, amount } = state;
      if (!frontCheque || !backCheque || !amount) {
        setMessage({ text: "Please upload both cheque images and enter amount", type: "error" });
        return;
      }

      const formData = new FormData();
      formData.append("frontCheque", frontCheque);
      formData.append("backCheque", backCheque);
      formData.append("amount", amount);

      const res = await api.post("/cheque-deposit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage({ text: "Cheque deposit successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({ text: "Cheque deposit failed", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Server error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-page">
      <h2>Deposit Funds</h2>
      {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

      {/* CARD DEPOSIT */}
      <form className="deposit-form" onSubmit={handleCardDeposit}>
        <h3>Add Debit Card</h3>
        <label>Card Number</label>
        <input
          type="number"
          onChange={(e) => dispatch({ type: "CARDNUMBER", payload: e.target.value })}
          placeholder="Card Number"
          required
        />
        <label>CVV</label>
        <input
          type="number"
          onChange={(e) => dispatch({ type: "CVV", payload: e.target.value })}
          placeholder="CVV"
          required
        />
        <label>Expiry Date</label>
        <input
          type="month"
          onChange={(e) => dispatch({ type: "EXPIRYDATE", payload: e.target.value })}
          required
        />
        <label>Amount</label>
        <input
          type="number"
          onChange={(e) => dispatch({ type: "AMOUNT", payload: e.target.value })}
          placeholder="Amount"
          required
        />
        <label>Card Pin</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength="4"
          onChange={(e) => dispatch({ type: "CARDPIN", payload: e.target.value })}
          placeholder="Card Pin"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Deposit via Card"}
        </button>
      </form>

      {/* CHEQUE DEPOSIT */}
      <form className="deposit-form" onSubmit={handleChequeDeposit}>
        <h3>Deposit Cheque</h3>
        <p>Endorse the cheque: Write your name on the back and add “For mobile deposit only”.</p>

        <label>Front of Cheque</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => dispatch({ type: "FRONTCHEQUE", payload: e.target.files[0] })}
          required
        />
        <label>Back of Cheque</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => dispatch({ type: "BACKCHEQUE", payload: e.target.files[0] })}
          required
        />
        <label>Amount</label>
        <input
          type="number"
          onChange={(e) => dispatch({ type: "AMOUNT", payload: e.target.value })}
          placeholder="Amount"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Deposit via Cheque"}
        </button>
      </form>
    </div>
  );
};

export default Deposit;
