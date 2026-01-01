import React, { useReducer, useState } from 'react'
import "./forgottenPassword.css"
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../../components/axiosInstance'

const reducer = (state, action) => {
  switch (action.type) {
    case "EMAIL":
      return { ...state, email: action.payload }
    default:
      console.log("Invalid Input")
      return state
  }
}

const ForgottenPassword = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [state, dispatch] = useReducer(reducer, { email: "" })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: "", type: "" })

    if (!state.email) {
      setMessage({ text: "Please enter your email.", type: "error" })
      return
    }

    setLoading(true)

    try {
      const res = await api.post("/submitted-email", {
        email: state.email
      })

      if (res.data.success) {
        setMessage({ text: res.data.message, type: "success" })
        setTimeout(() => navigate("/login"), 1500)
      } else {
        setMessage({ text: res.data.message, type: "error" })
      }
    } catch (error) {
      //console.error("Forgotten password error:", error)
      if (error.response && error.response.data?.message) {
        setMessage({ text: error.response.data.message, type: "error" })
      } else {
        setMessage({ text: "Network error or server not responding.", type: "error" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='forgot_container'>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => dispatch({ type: "EMAIL", payload: e.target.value })}
          placeholder='Enter your email'
          required
        />

        {message.text && (
          <p className={`form-message ${message.type}`}>{message.text}</p>
        )}

        <button type='submit' disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="back_link">
        <NavLink to="/login">← Back to Login</NavLink>
      </div>
    </div>
  )
}

export default ForgottenPassword
