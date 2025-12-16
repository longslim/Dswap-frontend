import React, { useReducer, useState } from "react";
import "./updatePassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "NEWPASSWORD":
      return { ...state, newPassword: action.payload };
    case "CONFIRMNEWPASSWORD":
      return { ...state, confirmNewPassword: action.payload };
    default:
      console.log("Invalid Input");
      return state;
  }
};

const UpdatePassword = () => {
  const [state, dispatch] = useReducer(reducer, {
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (state.newPassword !== state.confirmNewPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/v1/update-password/${id}/${token}`,
        { newPassword: state.newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setMessage({ text: res.data.message, type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ text: res.data.message, type: "error" });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage({ text: error.response.data.message, type: "error" });
      } else {
        setMessage({ text: "Network or server error.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update_container">
      <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <div className="password_field">
          <input
            type={showNewPassword ? "text" : "password"}
            value={state.newPassword}
            onChange={(e) =>
              dispatch({ type: "NEWPASSWORD", payload: e.target.value })
            }
            placeholder="New Password"
            required
          />
          <span
            className="toggle_eye"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Confirm New Password</label>
        <div className="password_field">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            value={state.confirmNewPassword}
            onChange={(e) =>
              dispatch({ type: "CONFIRMNEWPASSWORD", payload: e.target.value })
            }
            placeholder="Confirm New Password"
            required
          />
          <span
            className="toggle_eye"
            onClick={() =>
              setShowConfirmNewPassword(!showConfirmNewPassword)
            }
          >
            {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {message.text && (
          <p className={`form-message ${message.type}`}>{message.text}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Create New Password"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
