import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/axiosInstance";
import "./transactionDetails.css";

const TransactionDetails = ({ user }) => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // Try internal first
        let res = await api.get(`/transactions/${id}`);
        if (res.data.success) {
          setTransaction(res.data.transaction);
          setIsExternal(false);
        } else {
          // Fallback to external
          res = await api.get(`/external-transaction/${id}`);
          if (res.data.success) {
            setTransaction(res.data.transaction);
            setIsExternal(true);
          } else {
            setMessage({ text: "Transaction not found", type: "error" });
          }
        }
      } catch (error) {
        // Try external if internal failed
        try {
          const res = await api.get(`/external-transaction/${id}`);
          if (res.data.success) {
            setTransaction(res.data.transaction);
            setIsExternal(true);
          } else {
            setMessage({ text: "Transaction not found", type: "error" });
          }
        } catch (err) {
          setMessage({
            text: err.response?.data?.message || "Server error",
            type: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) return <p className="loading">Loading transaction details...</p>;
  if (message.text)
    return <p className={`message ${message.type}`}>{message.text}</p>;

  const isSent =
    !isExternal && transaction.sender?._id === user?._id;

  return (
    <div
      className={`transaction-details-card ${
        isExternal ? "external" : isSent ? "sent" : "received"
      }`}
    >
      <h3 className="transaction-title">
        {isExternal
          ? "External Bank Transfer"
          : isSent
          ? "Money Sent"
          : "Money Received"}
      </h3>

      <div className="transaction-info">
        {isExternal ? (
          <>
            <p><strong>Bank:</strong> {transaction.receiverBankName}</p>
            <p><strong>Account Number:</strong> {transaction.receiverAccountNumber}</p>
            <p><strong>Routing Number:</strong> {transaction.receiverRoutingNumber}</p>
            <p><strong>Amount:</strong> ${transaction.amount.toLocaleString()}</p>
            <p><strong>Status:</strong> {transaction.status}</p>
            <p><strong>Description:</strong> {transaction.description || "N/A"}</p>
            <p><strong>Reference:</strong> {transaction.reference}</p>
            <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
          </>
        ) : (
          <>
            <p><strong>Type:</strong> {isSent ? "Sent" : "Received"}</p>
            <p><strong>Amount:</strong> ${transaction.amount.toLocaleString()}</p>
            <p><strong>Status:</strong> {transaction.status}</p>
            <p><strong>Description:</strong> {transaction.description || "N/A"}</p>
            <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
            <p><strong>Sender:</strong> {transaction.sender?.firstname} {transaction.sender?.lastname}</p>
            <p><strong>Receiver:</strong> {transaction.receiver?.firstname} {transaction.receiver?.lastname}</p>
            <p><strong>Reference:</strong> {transaction.reference}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
