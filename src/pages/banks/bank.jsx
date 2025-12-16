import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import api from "../../components/axiosInstance";
import ConfirmModal from "../../components/modal/confirmModal";
import "./bank.css";

const Bank = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 🔗 Step 0: Fetch linked Plaid account if already connected
  const fetchLinkedAccounts = async () => {
    try {
      setRefreshing(true);
      const res = await api.get("/linked-accounts");

      if (res.data.success && res.data.accounts.length > 0) {
        const acc = res.data.accounts[0]; // assuming one account per user
        setAccount({
          access_token: res.data.access_token || "",
          account_id: acc.account_id,
          name: acc.name,
          mask: acc.mask,
          type: acc.subtype,
        });
        setMessage({
          text: `✅ Linked account detected: ${acc.name} (****${acc.mask})`,
          type: "success",
        });
      } else {
        setMessage({
          text: "No linked account found — connect your bank to continue.",
          type: "info",
        });
      }
    } catch (err) {
      console.error("Error fetching linked accounts:", err);
      setMessage({
        text: "Unable to fetch linked accounts. Please connect manually.",
        type: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  // 🏦 Step 1: Create Plaid Link Token
  const createLinkToken = async () => {
    try {
      const res = await api.post("/create-link-token");
      setLinkToken(res.data.link_token);
    } catch (err) {
      console.error("Link token error:", err);
      setMessage({ text: "Failed to create link token", type: "error" });
    }
  };

  // 🔄 Step 2: Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        const res = await api.post("/exchange-public-token", { public_token });
        const { access_token } = res.data;
        const accountInfo = metadata.accounts[0];

        setAccount({
          access_token,
          account_id: accountInfo.id,
          name: accountInfo.name,
          mask: accountInfo.mask,
          type: accountInfo.subtype,
        });

        setMessage({
          text: `✅ Linked ${accountInfo.name} (****${accountInfo.mask}) successfully`,
          type: "success",
        });
      } catch (err) {
        console.error("Exchange error:", err);
        setMessage({ text: "Failed to link bank account", type: "error" });
      }
    },
  });

  // 💸 Step 3: Submit External Transfer
  const handleTransfer = async () => {
    if (!account) {
      setMessage({ text: "Please link a bank account first.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/external-transfer", {
        access_token: account.access_token,
        account_id: account.account_id,
        amount,
        description,
      });

      if (res.data.success) {
        setMessage({ text: res.data.msg, type: "success" });
        setAmount("");
        setDescription("");
        setShowModal(false);
      } else {
        setMessage({ text: res.data.msg, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.msg || "Transfer failed. Try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ⚙️ Step 4: Open Confirmation Modal
  const handleConfirmModal = (e) => {
    e.preventDefault();

    if (!account) {
      setMessage({ text: "Please connect your bank first.", type: "error" });
      return;
    }

    if (!amount || !description) {
      setMessage({ text: "Enter all fields before continuing.", type: "error" });
      return;
    }

    setShowModal(true);
  };

  return (
    <div className="external-transfer-container">
      <div className="external-transfer-card">
        <h2>External Bank Transfer</h2>

        {/* 🏦 Plaid Link Section */}
        {!account && (
          <button
            onClick={linkToken ? open : createLinkToken}
            disabled={linkToken && !ready}
          >
            {linkToken ? "Open Plaid Link" : "Connect Bank Account"}
          </button>
        )}

        {/* 🔄 Refresh Linked Account */}
        {account && (
          <div className="linked-account">
            <p className="linked-info">
              Connected: <strong>{account.name}</strong> (****{account.mask})
            </p>
            <button
              type="button"
              onClick={fetchLinkedAccounts}
              disabled={refreshing}
              className="refresh-button"
            >
              {refreshing ? "Refreshing..." : "🔄 Refresh Linked Account"}
            </button>
          </div>
        )}

        {/* 💰 Transfer Form */}
        {account && (
          <form onSubmit={handleConfirmModal}>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />

            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction note"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? <span className="loader"></span> : "Send Transfer"}
            </button>
          </form>
        )}

        {/* 🧾 Confirmation Modal */}
        <ConfirmModal
          isOpen={showModal}
          title="Confirm Transfer"
          message={`Are you sure you want to send $${amount} to ${account?.name} (****${account?.mask})?`}
          confirmText="Yes, Send"
          cancelText="Cancel"
          onConfirm={handleTransfer}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />

        {/* 🗯️ Feedback Message */}
        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default Bank;
