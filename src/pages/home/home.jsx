import React from 'react'
import "./home.css"
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate()

  const services = [
    { name: "Seamless Transfer", icon: "💸" },
    { name: "Bitcoin Transaction", icon: "₿" },
    { name: "Loan Option", icon: "🏦" },
    { name: "Utility Approved", icon: "⚡" },
    { name: "Deposit Allowed", icon: "📥" },
    { name: "Virtual Card", icon: "💳" }
  ]

  return (
    <div className="home_data">
      
      <img src="/shape1.png" alt="" className="bg_img bg_img_1" />
      <img src="/shape2.png" alt="" className="bg_img bg_img_2" />

      <div className="home_content">
        <h2>Bank with us</h2>
        <h4>Enjoy these services and more</h4>

        <div className="services_grid">
          {services.map((service, index) => (
            <div key={index} className="service_card">
              <span className="service_icon">{service.icon}</span>
              <p>{service.name}</p>
            </div>
          ))}
        </div>

        <div className="auth_links">
          <button onClick={() => navigate("/signup")}>Signup</button>
          <button onClick={() => navigate("/login")} className="outline">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
