import React from "react";
import "./resultModal.css";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const ResultModal = ({ isOpen, type, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="result-overlay">
      <div className={`result-box ${type}`}>
        
        <div className="result-icon">
          {type === "success" ? (
            <AiOutlineCheckCircle className="icon success-icon" />
          ) : (
            <AiOutlineCloseCircle className="icon error-icon" />
          )}
        </div>

        <h3>{title}</h3>
        <p>{message}</p>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ResultModal;
