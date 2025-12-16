import React, { useEffect, useState } from "react";
import "./history.css";
import api from "../../components/axiosInstance";
import { useNavigate } from "react-router-dom";

const History = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [filters, setFilters] = useState({
    type: "all",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 5,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
  });

  const navigate = useNavigate();

  
  const getTransactions = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const queryParams = new URLSearchParams();
      if (filters.type !== "all") queryParams.append("type", filters.type);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      queryParams.append("page", filters.page);
      queryParams.append("limit", filters.limit);

      const [internalRes, externalRes] = await Promise.all([
        api.get(`/transactions?${queryParams.toString()}`),
        api.get(`/external-transaction?${queryParams.toString()}`),
      ]);

      const internalData = internalRes.data.transactions || [];
      const externalData = externalRes.data.transactions || [];

      
      const allTransactions = [...internalData, ...externalData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTransactions(allTransactions);
      setPagination({
        total: allTransactions.length,
        pages: Math.ceil(allTransactions.length / filters.limit),
        page: filters.page,
      });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error fetching transactions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    getTransactions();
  }, [filters]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      getTransactions();
    }, 15000000); 
    return () => clearInterval(syncInterval);
  }, []);

  
  const handleTransactionClick = (txId) => {
    navigate(`/transactions/${txId}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  
  if (loading) return <p className="loading">Loading transactions...</p>;
  if (message.text)
    return <p className={`message ${message.type}`}>{message.text}</p>;

  // Paginate merged data client-side
  const startIdx = (filters.page - 1) * filters.limit;
  const endIdx = startIdx + filters.limit;
  const displayedTransactions = transactions.slice(startIdx, endIdx);

  return (
    <div className="history_container">
      <h2>Transaction History</h2>

      
      <div className="filters">
        <div className="filter-group">
          <button
            className={filters.type === "all" ? "active" : ""}
            onClick={() => handleFilterChange("type", "all")}
          >
            All
          </button>
          <button
            className={filters.type === "sent" ? "active" : ""}
            onClick={() => handleFilterChange("type", "sent")}
          >
            Sent
          </button>
          <button
            className={filters.type === "received" ? "active" : ""}
            onClick={() => handleFilterChange("type", "received")}
          >
            Received
          </button>
        </div>

        <div className="filter-group">
          <label>
            Start Date:
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </label>
        </div>
      </div>

      
      <table className="transaction_table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Source</th>
            <th>Type</th>
            <th>Amount ($)</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedTransactions.length > 0 ? (
            displayedTransactions.map((tx, index) => (
              <tr
                key={tx._id || `external-${index}`}
                onClick={() => handleTransactionClick(tx._id)}
              >
                <td>
                  {tx.createdAt
                    ? new Date(tx.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </td>
                <td>{tx.external ? "External" : "Internal"}</td>
                <td className={`type ${tx.type}`}>
                  {tx.type?.charAt(0).toUpperCase() + tx.type?.slice(1)}
                </td>
                <td>{tx.amount?.toLocaleString()}</td>
                <td>{tx.description || "—"}</td>
                <td className={`status ${tx.status?.toLowerCase()}`}>
                  {tx.status || "Pending"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      
      <div className="pagination">
        <button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Prev
        </button>
        <span>
          Page {filters.page} of {pagination.pages || 1}
        </span>
        <button
          disabled={filters.page === pagination.pages}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default History;
