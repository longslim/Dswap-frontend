import React from "react";
import { useNavigate } from "react-router-dom";
import { utilityServices } from "../../components/services";
import "./utility.css";

const Utility = () => {
  const navigate = useNavigate();

  return (
    <div className="utility-page">
      <h2>Utilities & Services</h2>

      <div className="utilities">
        {utilityServices.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.category}
              className="utility-card"
              onClick={() => navigate("/pay-utility", {
                 state: {
                  name: service.name,
                  category: service.category,
                  providers: service.providers
                 }
                 })
                }
            >
              <span className="icon">
                <Icon size={28} /> 
              </span>

              <h6>{service.name}</h6>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Utility;



