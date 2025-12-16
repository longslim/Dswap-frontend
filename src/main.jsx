import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <App/>
    </BrowserRouter>
  </StrictMode>,
)




//access info anywhere

// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user } = useAuth();
//   return <h2>Welcome, {user?.firstname}!</h2>;
// };
