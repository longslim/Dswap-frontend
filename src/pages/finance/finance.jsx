import React from 'react'
import "./finance.css"
import { BsCurrencyBitcoin } from 'react-icons/bs';
import { MdCallReceived } from "react-icons/md";
import { BsSendCheck } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import BtcChart from '../btc/btcChart';
import Footer from '../../components/footer/footer';

const Finance = () => {

  const navigate = useNavigate()
  return (
    <div className="finance_container">
      <div className="finance_chart">
        <BtcChart/>
      </div>
      <div className="finance_contain">
        <div className="finance_purchase" onClick={() => navigate("/btc-purchase")}>
          <BsCurrencyBitcoin />
          <h3>Buy Bitcoin</h3>
        </div>
        <div className="finance_receive" onClick={() => navigate("/deposits")}>
          <MdCallReceived />
          <h3>Receive Bitcoin</h3>
        </div>
        <div className="finance_send" onClick={() => navigate("/withdraw")}>
          <BsSendCheck />
          <h3>Send Bitcoin</h3>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Finance
