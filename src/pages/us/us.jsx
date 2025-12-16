import React, { useReducer, useState, useEffect } from "react";
import "./us.css";
import api from "../../components/axiosInstance";
import ConfirmModal from "../../components/modal/confirmModal";
import ResultModal from "../../components/modal/resultModal";

const reducer = (state, action) => {
  switch (action.type) {
    case "RECEIVERACCOUNTNUMBER":
      return { ...state, receiverAccountNumber: action.payload };
    case "AMOUNT":
      return { ...state, amount: action.payload };
    case "DESCRIPTION":
      return { ...state, description: action.payload };
    case "RESET":
      return { receiverAccountNumber: "", amount: "", description: "" };
    default:
      return state;
  }
};

const Us = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [receiverName, setReceiverName] = useState("");
  const [verified, setVerified] = useState(false);

  // 🔥 NEW STATES FOR RESULT MODAL
  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState(""); // "success" | "error"
  const [resultMessage, setResultMessage] = useState("");

  const [state, dispatch] = useReducer(reducer, {
    receiverAccountNumber: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const verifyAccount = async () => {
      if (state.receiverAccountNumber.length < 10) {
        setReceiverName("");
        setVerified(false);
        return;
      }

      setVerifying(true);
      setReceiverName("Verifying account...");

      try {
        const res = await api.get(`/verify-account/${state.receiverAccountNumber}`);
        if (res.data.success) {
          const { firstname, lastname } = res.data.user;
          setReceiverName(`${firstname} ${lastname}`);
          setVerified(true);
        } else {
          setReceiverName("Account not found");
          setVerified(false);
        }
      } catch (error) {
        setReceiverName("Error verifying account");
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (state.receiverAccountNumber) verifyAccount();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [state.receiverAccountNumber]);

  const handleConfirmTransfer = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await api.post("/internal-transfer", {
        receiverAccountNumber: state.receiverAccountNumber,
        amount: state.amount,
        description: state.description,
      });

      if (res.data.success) {
        // 🔥 OPEN RESULT MODAL
        setResultType("success");
        setResultMessage(res.data.message);
        setResultOpen(true);

        // Reset form
        dispatch({ type: "RESET" });
        setReceiverName("");
        setVerified(false);
      } else {
        setResultType("error");
        setResultMessage(res.data.message);
        setResultOpen(true);
      }
    } catch (error) {
      setResultType("error");
      setResultMessage(
        error.response?.data?.message || "Network error or server not responding."
      );
      setResultOpen(true);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();

    if (!verified) {
      setMessage({
        text: "Please enter a valid receiver account before proceeding.",
        type: "error",
      });
      return;
    }

    if (!state.amount || !state.description) {
      setMessage({ text: "Please fill all required fields.", type: "error" });
      return;
    }

    setShowModal(true);
  };

  const isFormComplete =
    verified && state.amount && state.description && !verifying && !loading;

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <h2>Transfer to US Bank</h2>

        <form onSubmit={handlePreSubmit}>
          <label>Receiver Account</label>
          <input
            type="number"
            value={state.receiverAccountNumber}
            disabled={loading}
            onChange={(e) =>
              dispatch({
                type: "RECEIVERACCOUNTNUMBER",
                payload: e.target.value,
              })
            }
            placeholder="Enter US bank account number"
            required
          />

          {receiverName && (
            <p className={`verify-text ${verified ? "success" : "error"}`}>
              {receiverName}
            </p>
          )}

          <label>Amount</label>
          <input
            type="number"
            value={state.amount}
            disabled={loading}
            onChange={(e) => dispatch({ type: "AMOUNT", payload: e.target.value })}
            placeholder="Enter amount"
            required
          />

          <label>Description</label>
          <input
            type="text"
            value={state.description}
            disabled={loading}
            onChange={(e) =>
              dispatch({ type: "DESCRIPTION", payload: e.target.value })
            }
            placeholder="Transaction description"
            required
          />

          <button
            type="submit"
            disabled={!isFormComplete}
            className={!isFormComplete ? "disabled-btn" : ""}
          >
            {loading ? <span className="loader"></span> : "Transfer"}
          </button>
        </form>

        <ConfirmModal
          isOpen={showModal}
          title="Confirm Transaction"
          message={`Send $${state.amount} to ${receiverName}?`}
          confirmText="Yes, Proceed"
          cancelText="Cancel"
          onConfirm={handleConfirmTransfer}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />

        {/* 🔥 FULLY FUNCTIONAL RESULT MODAL */}
        <ResultModal
          isOpen={resultOpen}
          type={resultType}
          title={resultType === "success" ? "Success!" : "Failed!"}
          message={resultMessage}
          onClose={() => setResultOpen(false)}
        />

        {message.text && (
          <p className={message.type === "error" ? "error" : "success"}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Us;
