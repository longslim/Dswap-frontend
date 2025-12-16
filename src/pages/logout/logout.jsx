import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/axiosInstance";
import ConfirmModal from "../../components/modal/confirmModal";

const LogoutButton = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleLogout = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await api.get("/logout-user");

      if (res.data.success) {
        setUser(null);

        setMessage({ text: "Logout successful!", type: "success" });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage({
          text: res.data.message || "Failed to sign out",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Server error",
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
            style={{padding: "10px"}}
            onClick={() => setShowModal(true)}
            disabled={loading}
      >
            {loading ? "Logging out..." : "Logout"}
      </button>

      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}

      <ConfirmModal
        isOpen={showModal}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />
    </>
  );
};

export default LogoutButton;
