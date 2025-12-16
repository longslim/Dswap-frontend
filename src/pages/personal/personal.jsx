import React, { useState } from "react";
import "./personal.css";
import CreatePinModal from "../../components/modal/createPinModal";
import ChangePinModal from "../../components/modal/changePinModal";
import { useNavigate } from "react-router-dom";

const Personal = () => {
  const navigate = useNavigate();

  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);

  return (
    <div className="personal-page">
      <div onClick={() => navigate("/profile")}>
        <h3>Profile</h3>
      </div>

      <div onClick={() => setShowCreatePinModal(true)}>
        <h3>Create PIN</h3>
      </div>

      <div onClick={() => setShowChangePinModal(true)}>
        <h3>Change PIN</h3>
      </div>

      {/* Create PIN Modal */}
      <CreatePinModal
        isOpen={showCreatePinModal}
        onClose={() => setShowCreatePinModal(false)}
        onSuccess={(data) => {
          console.log("PIN created", data);
        }}
      />

      {/* Change PIN Modal */}
      <ChangePinModal
        isOpen={showChangePinModal}
        onClose={() => setShowChangePinModal(false)}
        onSuccess={(data) => {
          console.log("PIN changed", data);
        }}
      />
    </div>
  );
};

export default Personal;
