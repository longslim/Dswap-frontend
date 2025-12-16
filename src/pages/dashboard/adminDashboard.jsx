import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import api from "../../components/axiosInstance";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../logout/logout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("dashboard");
  

  const [adminForm, setAdminForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [updateForm, setUpdateForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [allUsers, setAllUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);

  const [btcStats, setBtcStats] = useState(null)
  const [btcLoading, setBtcLoading] = useState(true)
  const [btcActionLoading, setBtcActionLoading] = useState(null)


  const [loans, setLoans] = useState([])
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [adminMessage, setAdminMessage] = useState("")
  const[sending, setSending] = useState(false)

  const [utility, setUtility] = useState([])

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get("/admin-profile");
        if (res.data.user.role !== "admin") {
          navigate("/login");
        } else {
          setAdmin(res.data.user);
        }
      } catch {
        navigate("/login");
      }
    };
    fetchAdminData();
    fetchProfile();
    fetchAllUsers();
    fetchTransactions();
    fetchPendingDeposits();
    fetchBtcStats();
  }, []);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/admin-profile");
      setAdmin(res.data.user);
      setUpdateForm({
        firstname: res.data.user.firstname,
        lastname: res.data.user.lastname,
        email: res.data.user.email,
        password: "",
      });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to load profile", type: "error" });
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/all-users");
      setAllUsers(res.data.users || []);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to load users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await api.get("/admin-transactions");
      setTransactions(res.data.transactions || []);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to load transactions",
        type: "error",
      });
    }
  };

  // Fetch all pending cheque deposits
  const fetchPendingDeposits = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-deposits?status=pending");
      if (res.data.success) {
        setDeposits(res.data.deposits || []);
      } else {
        setMessage({ text: "Failed to fetch deposits", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchBtcStats = async () => {
    try {
      setBtcLoading(true)
      const res = await api.get("/admin-stats")
      setBtcStats(res.data)
    } catch (err) {
      console.error(err)
      setMessage({text: "Failed to load BTC stats", type: "error"})
    } finally{
      setBtcLoading(false)
    }
  }


  const handleProcessBtc = async (id) => {
    setBtcActionLoading(id)
    try {
      await api.post(`/admin/withdraw/${id}/process`)
      await fetchBtcStats()
    } catch (err) {
      alert(err?.response.data?.message || "Process failed")
    } finally {
      setBtcActionLoading(null)
    }
  }


  const handleRejectBtc = async (id) => {
    setBtcActionLoading(id)
    try {
      await api.post(`/admin/withdraw/${id}/reject`)
      await fetchBtcStats()
    } catch (err) {
      alert(err?.response?.data?.message || "Reject failed")
    } finally {
      setBtcActionLoading(null)
    }
  }

  // Create new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/create-admin", adminForm);
      setMessage({ text: res.data.message, type: "success" });
      setAdminForm({ firstname: "", lastname: "", email: "", password: "" });
      fetchAllUsers();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error creating admin",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update admin profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put("/admin/update-profile", updateForm);
      setMessage({ text: res.data.message, type: "success" });
      fetchProfile();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error updating profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Approve cheque deposit
  const handleApprove = async (id) => {
    try {
      setProcessing(true);
      const res = await api.patch(`/admin-deposits/${id}/approve`);
      if (res.data.success) {
        setMessage({ text: res.data.message, type: "success" });
        fetchPendingDeposits();
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to approve deposit", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  // Reject cheque deposit
  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason (optional)");
    if (reason === null) return;
    try {
      setProcessing(true);
      const res = await api.patch(`/admin-deposits/${id}/reject`, { reason });
      if (res.data.success) {
        setMessage({ text: "Deposit rejected", type: "success" });
        fetchPendingDeposits();
      } else {
        setMessage({ text: res.data.msg || "Failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchLoans()
    fetchUtility()
  }, [])

  const fetchLoans = async () => {
    try {
      const res = await api.get("/allLoans")
      setLoans(res.data.loans)
      setLoading(false)
    } catch (err) {
      console.log("Fetch loans error:", err)
      setLoading(false)
    }
  }


  const handleVerifyBTC = async (loanId) => {
    try {
      await api.patch(`/${loanId}/verify-btc`);
      fetchLoans();
      setMessage({text: "BTC payment verified successfully", type: "success"})
    } catch (err) {
      console.log(err);
      setMessage({ text: "Failed to verify BTC payment", type: "error" })
    }
  };


  const handleApproveLoan = async (loanId) => {
    try {
      await api.patch(`/${loanId}/approve`);
      fetchLoans();
      setMessage({text: "Loan approved successfully", type: "success"})
    } catch (err) {
      console.log(err);
      setMessage({ text: "Failed to approve loan", type: "error" })
    }
  };


  const handleRejectLoan = async (loanId) => {
    try {
      await api.patch(`/${loanId}/reject`);
      fetchLoans();
      setMessage({text: "Loan rejected successfully", type: "success"})
    } catch (err) {
      console.log(err);
      setMessage({ text: "Failed to reject loan", type: "error" })
    }
  };


  const handleSendMessage = async () => {
    if (!adminMessage.trim()) return;

    try {
      setSending(true);
      await api.post(`/${selectedLoan._id}/send-message`, {
        message: adminMessage,
      });
      setAdminMessage("");
      setSelectedLoan(null);
      setSending(false);
      setMessage({text: "Message sent to user successfully", type: "success"})
    } catch (err) {
      console.log(err);
      setSending(false);
      setMessage({ text: "Failed to send message", type: "error" })
    }
  };



  const fetchUtility = async () => {
    try {
      setLoading(true);
      const res = await api.get("/allPending");
      setUtility(res.data.pending || []);
    } catch (err) {
      console.log("Fetch utility error:", err);
      setMessage({ text: "Failed to fetch utilities", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  


  const handleApproveUtility = async (id) => {
    try {
      setProcessing(true);
      await api.put(`/utility-approve/${id}`);
      setMessage({ text: "Bill payment approved", type: "success" });
      fetchUtility();
    } catch (err) {
      console.log(err);
      setMessage({ text: "Failed to approve bill payment", type: "error" });
    } finally {
      setProcessing(false);
    }
  };
  



  const handleRejectUtility = async (id) => {
    try {
      setProcessing(true);
      await api.put(`/utility-reject/${id}`);
      setMessage({ text: "Bill payment rejected", type: "success" });
      fetchUtility();
    } catch (err) {
      console.log(err);
      setMessage({ text: "Failed to reject bill payment", type: "error" });
    } finally {
      setProcessing(false);
    }
  };
  


  return (
    <div className="admin-dashboard-container">
        {(loading || processing) && (
            <div className="loading-overlay">
                <div>
                <div className="spinner"></div>
                <p className="loading-text">
                    {processing ? "Processing request..." : "Loading..."}
                </p>
                </div>
            </div>
        )}

      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="header-buttons">
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("profile")}>Profile</button>
          <button onClick={() => setActiveTab("transactions")}>Transactions</button>
          <button onClick={() => setActiveTab("cheques")}>Cheque Deposits</button>
          <button onClick={() => setActiveTab("btc")}>BTC</button>
          <button onClick={() => setActiveTab("loans")}>Loans</button>
          <button onClick={() => setActiveTab("utility")}>Utility</button>
        </div>
      </header>

      {message.text && (
        <div className={`message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <>
          <section className="create-admin-section">
            <h3>Create New Admin</h3>
            <form onSubmit={handleCreateAdmin}>
              <input
                type="text"
                placeholder="First Name"
                value={adminForm.firstname}
                onChange={(e) => setAdminForm({ ...adminForm, firstname: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={adminForm.lastname}
                onChange={(e) => setAdminForm({ ...adminForm, lastname: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </form>
          </section>

          <section className="users-list-section">
            <h3>All Users</h3>
            {allUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {/* Profile */}
      {activeTab === "profile" && admin && (
        <section className="admin-profile-section">
          <h3>My Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <input
              type="text"
              name="firstname"
              value={updateForm.firstname}
              onChange={(e) => setUpdateForm({ ...updateForm, firstname: e.target.value })}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastname"
              value={updateForm.lastname}
              onChange={(e) => setUpdateForm({ ...updateForm, lastname: e.target.value })}
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={updateForm.email}
              onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              value={updateForm.password}
              onChange={(e) => setUpdateForm({ ...updateForm, password: e.target.value })}
              placeholder="New Password (optional)"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </section>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <section className="admin-transactions-section">
          <h3>All Transactions</h3>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn.sender?.firstname} {txn.sender?.lastname}</td>
                    <td>{txn.receiver?.firstname} {txn.receiver?.lastname}</td>
                    <td>${txn.amount}</td>
                    <td>{txn.type}</td>
                    <td>{txn.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Cheque Deposits */}
      {activeTab === "cheques" && (
        <section className="pending-deposits-section">
          <h3>Pending Cheque Deposits</h3>
          {loading ? (
            <p>Loading deposits...</p>
          ) : deposits.length === 0 ? (
            <p>No pending cheque deposits.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Account</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((dep) => (
                  <tr key={dep._id}>
                    <td>{dep.user?.firstname} {dep.user?.lastname}</td>
                    <td>${dep.amount}</td>
                    <td>{dep.user?.accountNumber}</td>
                    <td>{dep.status}</td>
                    <td>
                      <button disabled={processing} onClick={() => handleApprove(dep._id)}>Approve</button>
                      <button disabled={processing} onClick={() => handleReject(dep._id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {activeTab === "btc" && (
        <div className="btc-admin-wrapper">
          <h2>BTC Admin Dashboard</h2>

          {btcLoading ? (
            <p>Loading BTC stats...</p>
          ) : (
            <>
              <div className="btc-stats-grid">
                <div className="btc-box">
                  <h3>Total BTC Deposit</h3>
                  <p className="amount">{btcStats?.totals?.withdrawals?.totalBTC ?? 0}</p>
                  <small>{btcStats?.totals?.withdrawals?.count?? 0} transactions</small>
                </div>
              </div>

              <h3>Pending BTC Withdrawals</h3>

              {btcStats?.pending?.length === 0 ? (
                <p>No pending BTC withdrawals</p>
              ) : (
                <table className="btc-table">
                  <thead>
                    <tr>
                      <th>Users</th>
                      <th>Amount</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {btcStats?.pending?.map((tx) => (
                      <tr key={tx._id}>
                        <td>{tx.user?.firstname} {tx.user?.lastname}</td>
                        <td>{tx.btcAmount}</td>
                        <td>{tx.btcAddress}</td>
                        <td>{tx.status}</td>
                        <td>
                          <button
                            className="approve-btn"
                            disabled={btcActionLoading === tx._id}
                            onClick={() => handleProcessBtc(tx._id)}
                          >
                            {btcActionLoading === tx._id ? "..." : "Process"}
                          </button>

                          <button
                            className="reject-btn"
                            disabled={btcActionLoading === tx._id}
                            onClick={() => handleRejectBtc}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      )}


      {/* LOANS TAB */}
      {activeTab === "loans" && (
        <section className="loan-management-section">
          <h3>Loan Applications</h3>

          {loans.length === 0 ? (
            <p>No loan applications yet.</p>
          ) : (
            <table className="loan-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>BTC % Required</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.user?.firstname} {loan.user?.lastname}</td>
                    <td>${loan.amount}</td>
                    <td>{loan.durationMonths} months</td>
                    <td>{loan.btcPaymentPercent}%</td>
                    <td>{loan.status}</td>

                    <td>
                      {/* VERIFY BTC */}
                      {(loan.status === "awaiting-btc" ||
                        loan.status === "processing"
                      ) && (
                        <button
                          onClick={() => handleVerifyBTC(loan._id)}
                          className="approve-btn"
                        >
                          Verify BTC
                        </button>
                      )}

                      {/* APPROVE LOAN */}
                      {loan.status === "processing" && (
                        <button
                          onClick={() => handleApproveLoan(loan._id)}
                          className="approve-btn"
                        >
                          Approve
                        </button>
                      )}

                      {/* REJECT LOAN */}
                      {(loan.status === "awaiting-btc" ||
                        loan.status === "processing") && (
                        <button
                          onClick={() => handleRejectLoan(loan._id)}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      )}

                      {/* SEND MESSAGE */}
                      <button
                        className="message-btn"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        Message User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* MESSAGE POPUP */}
          {selectedLoan && (
            <div className="loan-message-popup">
              <h4>Send Message to: {selectedLoan.user.firstname}</h4>

              <textarea
                placeholder="Write your message..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
              ></textarea>

              <button
                disabled={sending}
                onClick={handleSendMessage}
                className="approve-btn"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>

              <button
                className="reject-btn"
                onClick={() => setSelectedLoan(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      )}


      {activeTab === "utility" && (
        <section className="pending-utility-section">
          <h3>Pending Utility Payment</h3>
          {loading ? (
            <p>Loading utilities...</p>
          ) : utility.length === 0 ? (
            <p>No pending utility payment.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Category</th>
                  <th>Provider</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {utility.map((item) => (
                  <tr key={item._id}>
                    <td>{item.user?.firstname} {item.user?.lastname}</td>
                    <td>{item.category}</td>
                    <td>{item.utilityProvider}</td>
                    <td>{item.accountNumber}</td>
                    <td>${item.amount}</td>
                    <td>
                      <button disabled={processing} onClick={() => handleApproveUtility(item._id)}>Approve</button>
                      <button disabled={processing} onClick={() => handleRejectUtility(item._id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}


      <div className="logout-container">
        <LogoutButton setUser={setUser} />
      </div>
    </div>
  );
};

export default AdminDashboard;
