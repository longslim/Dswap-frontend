import React from 'react'
import "./footer.css"
import { MdHomeMini } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { HiOutlineCreditCard } from "react-icons/hi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate()

  return (
    <div>
      <div className='foot'> 
        <div className='foot_home' onClick={() => navigate("/dashboard")}>
            <MdHomeMini />
            <h6>Home</h6>
        </div>
        <div className='foot_finance' onClick={() => navigate("/finance")}>
            <AiOutlineStock />
            <h6>Finance</h6>
        </div>
        <div className='foot_card' onClick={() => navigate("/card")}>
            <HiOutlineCreditCard />
            <h6>Cards</h6>
        </div>
        <div className='foot_loan' onClick={(e) => navigate("/loan")}>
          <FaHandHoldingDollar />
          <h6>Loan</h6>
        </div>
        <div className='foot_personal' onClick={() => navigate("/personal")}>
            <IoPersonCircleOutline />
            <h6>Personal</h6>
        </div>
      </div>
    </div>
  )
}

export default Footer
