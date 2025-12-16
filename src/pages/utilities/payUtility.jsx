import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../components/axiosInstance";
import "./payUtility.css"

const PayUtility = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    utilityProvider: "",
    accountNumber: "",
    amount: "",
    cardPin: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!state) {
    navigate("/utility");
    return null;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        category: state.category,
        utilityProvider: form.utilityProvider,
        accountNumber: form.accountNumber,
        amount: Number(form.amount),
        cardPin: form.cardPin
      };

      const { data } = await api.post("/pay-utility", payload);
      setMessage(data.message);
      setForm({ utilityProvider: "", accountNumber: "", amount: "", cardPin: "" });

    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="utility-form">
      <h2>{state.name} Payment</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={submitHandler}>
        <select
          name="utilityProvider"
          value={form.utilityProvider}
          onChange={handleChange}
          required
        >
          <option value="">Select Provider</option>
          {state.providers.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <input
          type="text"
          name="accountNumber"
          placeholder="Account / Meter / Booking ID"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="cardPin"
          placeholder="Transaction PIN"
          value={form.cardPin}
          onChange={handleChange}
          required
        />

        <button disabled={loading}>
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

export default PayUtility;
