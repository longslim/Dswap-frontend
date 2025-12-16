import React, { useEffect, useState } from "react";
import "./profile.css";
import api from "../../components/axiosInstance";
import LogoutButton from "../logout/logout";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });


  

  
  const getProfile = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      
      const res = await api.get("/user-profile");

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setMessage({ text: res.data.message || "Failed to fetch user profile", type: "error" });
      }
    } catch (error) {
      //console.error("Profile fetch error:", error);
      setMessage({
        text: error.response?.data?.message || "Server error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);


  if (loading) return <p className="loading">Loading profile...</p>;
  if (message.text)
    return <p className={`message ${message.type}`}>{message.text}</p>;

  return (
    <div className="profile_container">
      <h2>User Profile</h2>

      <div className="profile_card">
        <h6>Account Number: <span>{user?.accountNumber}</span></h6>
        <h6>Full Name: <span>{user?.firstname} {user?.lastname}</span></h6>
        <h6>Mobile Number: <span>{user?.mobileNo}</span></h6>
        <h6>Date of Birth: <span>{user?.dob ? new Date(user.dob).toLocaleDateString("en-US") : "N/A"}</span></h6>
        <h6>Email: <span>{user?.email}</span></h6>
        <h6>SSN: <span>{user?.ssn}</span></h6>
        <h6>Address: <span>{user?.address}</span></h6>
      </div>
      <div className="log">
        <LogoutButton setUser={setUser}/>
      </div>
    </div>
  );
};

export default Profile;
