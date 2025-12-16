import React, { useEffect, useState } from "react";
import api from "../../components/axiosInstance";
import QRCode from "react-qr-code";
import "./btcDeposit.css";

const BtcDeposit = () => {
  const [depositAddress, setDepositAddress] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [usdEquivalent, setUsdEquivalent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get BTC price
  const getPrice = async () => {
    try {
      const res = await api.get("/price");
      setPrice(res.data.bitcoin.usd);
    } catch (err) {
      console.error(err);
    }
  };

  // Generate deposit address
  const createDepositAddress = async () => {
    try {
      setLoading(true);
      const res = await api.post("/create-deposit");
      setDepositAddress(res.data.depositAddress);
      setReferenceId(res.data.referenceId);
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Get user BTC balance
  const getBalance = async () => {
    try {
      const res = await api.get("/balances");
      const bal = res.data.balances?.btc || 0;
      setBalance(bal);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-update every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      getBalance();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getPrice();
    getBalance();
    createDepositAddress();
  }, []);

  // Copy function
  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    const usd = balance * price;
    setUsdEquivalent(usd);
  }, [balance, price]);

  // Manual refresh button
  const manualRefresh = async () => {
    setRefreshing(true);
    await getBalance();
    await getPrice();
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="btcDepositBox">
      <h2 className="title">Deposit Bitcoin</h2>

      <div className="topRow">
        <p className="btcPrice">BTC Price: ${price}</p>

        <button className="refreshBtn" onClick={manualRefresh}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="balanceBox">
        <div>
          <span className="label">Your BTC Balance:</span>
          <strong className="value">{balance.toFixed(8)} BTC</strong>
        </div>

        <div>
          <span className="label">USD Value:</span>
          <strong className="value">
            $
            {usdEquivalent.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>
      </div>

      {loading ? (
        <p className="loading">Generating deposit address...</p>
      ) : (
        <>
          <p className="addressLabel">Your BTC Deposit Address</p>

          <div className="addressBox">
            <span>{depositAddress}</span>

            <button className="copyBtn" onClick={copyAddress}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {depositAddress && (
            <div className="qrWrapper">
              <QRCode value={depositAddress} size={200} />
            </div>
          )}

          <p className="refId">Reference ID: {referenceId}</p>

          <p className="infoNote">
            Send BTC to this address. Deposit updates automatically when it's confirmed.
          </p>
        </>
      )}
    </div>
  );
};

export default BtcDeposit;
