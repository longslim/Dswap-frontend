import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { IoIosContact } from "react-icons/io";
import { CiBank } from "react-icons/ci";
import { PiHandWithdraw } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import DashboardCarousel from "../../components/carousel/dashboardCarousel";
import api from "../../components/axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const [userRes, internalTxRes, externalTxRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/transactions?limit=4&page=1"),
        api.get("/external-transaction"),
      ]);

      if (userRes.data.success) {
        setUser(userRes.data.user);
      }

      let allTransactions = [];

      // 🟢 Internal transactions
      if (internalTxRes.data.success && Array.isArray(internalTxRes.data.transactions)) {
        const formattedInternal = internalTxRes.data.transactions.map((tx) => ({
          ...tx,
          type: tx.sender?._id === userRes.data.user?._id ? "Sent" : "Received",
          source: "internal",
        }));
        allTransactions.push(...formattedInternal);
      }

      // 🔵 External transactions
      if (externalTxRes.data.success && Array.isArray(externalTxRes.data.transactions)) {
        const formattedExternal = externalTxRes.data.transactions.map((tx) => ({
          ...tx,
          type: "External Transfer",
          source: "external",
        }));
        allTransactions.push(...formattedExternal);
      }

      // 🔄 Sort by date
      allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // 🧩 Keep the latest 4
      setTransactions(allTransactions.slice(0, 4));

    } catch (error) {
      console.error(error);
      setMessage({
        text: error.response?.data?.message || "Server error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // 🟡 Handle click on transaction
  const handleTransactionClick = (tx) => {
    if (tx.source === "external") {
      navigate(`/external-transaction/${tx._id}`);
    } else {
      navigate(`/transactions/${tx._id}`);
    }
  };

  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (message.text) return <p className={`message ${message.type}`}>{message.text}</p>;

  return (
    <div className="dashboard">
      {/* ===== Balance Section ===== */}
      <div className="balance">
        <div className="available">
          <div className="avail">
            <h6>Available Balance</h6>
            <span
              className="toggle_i"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <h6 onClick={() => navigate("/history")}>Transaction History</h6>
        </div>

        <div className="money">
          <p>{showBalance ? `$${user?.balance?.toLocaleString()}` : "****"}</p>
          <div className="add" onClick={() => navigate("/deposit")}>
            <MdAdd />
            <h5>Add Money</h5>
          </div>
        </div>
      </div>

      {/* ===== Recent Transactions ===== */}
      <div className="transactions">
        <h4>Recent Transactions</h4>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((tx, i) => (
              <li
                key={i}
                onClick={() => handleTransactionClick(tx)}
                className="transaction-item"
              >
                <div className="tx-info">
                  <span
                    className={`tx-type ${
                      tx.source === "external" ? "external-tx" : ""
                    }`}
                  >
                    {tx.type}
                  </span>
                  <span className="tx-amount">
                    ${tx.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="tx-date">
                  {new Date(tx.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tx">No recent transactions</p>
        )}
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="banks">
        <div className="us" onClick={() => navigate("/us")}>
          <IoIosContact />
          <h5>To Us</h5>
        </div>
        <div className="bank" onClick={() => navigate("/banks")}>
          <CiBank />
          <h5>To Banks</h5>
        </div>
        <div className="deposit" onClick={() => navigate("/deposit")}>
          <PiHandWithdraw />
          <h5>Deposit</h5>
        </div>
        <div className="utility" onClick={() => navigate("/utility")}>
          <GiHamburgerMenu />
          <h5>Utility</h5>
        </div>
      </div>

      <DashboardCarousel />
      <Footer />
    </div>
  );
};

export default Dashboard;
