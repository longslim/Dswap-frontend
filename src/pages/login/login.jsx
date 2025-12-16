import React, { useReducer, useState } from 'react'
import "./login.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from '../../components/axiosInstance';

const reducer = (state, action) => {
  switch (action.type) {
    case "EMAIL":
      return { ...state, email: action.payload }
    case "PASSWORD":
      return { ...state, password: action.payload }
    default:
      return state
  }
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [state, dispatch] = useReducer(reducer, { email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: "", type: "" }) 

    if (!state.email || !state.password) {
      setMessage({ text: "Please fill all required fields.", type: "error" })
      return
    }

    setLoading(true)

    try {
      const res = await api.post("/login-user", {
        email: state.email,
        password: state.password
      }, { withCredentials: true });

      if (res.data.success) {
        const user = res.data.user
        setMessage({ text: res.data.message, type: "success" })
        setTimeout(() => {
          if(user.role==="admin"){
            navigate("/admin-dashboard")
          } else {navigate("/dashboard")}
        } , 1500)
      } else {
        setMessage({ text: res.data.message, type: "error" })
      }

    } catch (error) {
      console.error("Login error:", error)
      if (error.response && error.response.data?.message) {
        setMessage({ text: error.response.data.message, type: "error" })
      } else {
        setMessage({
          text: "Network error or server not responding.",
          type: "error"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login_container'>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={state.email}
          onChange={(e) => dispatch({ type: "EMAIL", payload: e.target.value })}
          placeholder='Email'
          required
        />

        <label>Password</label>
        <div className="password_field">
          <input
            type={showPassword ? "text" : "password"}
            value={state.password}
            onChange={(e) => dispatch({ type: "PASSWORD", payload: e.target.value })}
            placeholder="Password"
            required
          />
          <span
            className="toggle_eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

       
        {message.text && (
          <p className={`form-message ${message.type}`}>
            {message.text}
          </p>
        )}

        <button type='submit' disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <NavLink to="/forgottenPassword">Forgotten Password</NavLink>
      </form>

      <div className='signup_redirect'>
        <p>
          Create new account <span><NavLink to="/signup">Sign up</NavLink></span>
        </p>
      </div>
    </div>
  )
}

export default Login
