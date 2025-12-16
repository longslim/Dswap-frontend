import React, { useEffect, useReducer, useState } from 'react'
import "./signup.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import api from '../../components/axiosInstance';

const reducer = (state, action) => {
  switch(action.type) {
    case "FIRSTNAME" :
      return{...state, firstname: action.payload}
    case "LASTNAME" :
      return{...state, lastname: action.payload}
    case "EMAIL" :
      return{...state, email: action.payload}
    case "DOB" :
      return{...state, dob: action.payload}
    case "MOBILENO" :
      return{...state, mobileNo: action.payload}
    case "ADDRESS" :
    return{...state, address: action.payload}
    case "SSN" :
      return{...state, ssn: action.payload}
    case "IDTYPE" :
      return{...state, idType: action.payload}
    case "FRONTID" :
      return{...state, frontId: action.payload}
    case "BACKID" :
      return{...state, backId: action.payload}
    case "PASSWORD" :
      return{...state, password: action.payload}
    case "CONFIRMPASSWORD" :
      return{...state, confirmPassword: action.payload}
    default:
      console.log("Invalid Input")
      return state
  }
}

const Signup = () => {

  

  const [message, setMessage] = useState({text: "", type: ""})
  const [pickId, setpickId] = useState(-1)
  const [loading, setLoading] = useState(false)
  

  const ids = ["Driver License", "State ID"]
  const idToIndex = (idType) => ids.indexOf(idType)

  const [state, dispatch] = useReducer(reducer, {
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    mobileNo: "",
    address: "",
    ssn: "",
    idType: "",
    frontId: null,
    backId: null,
    password: "",
    confirmPassword: ""
  })


  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)



  const navigate = useNavigate()

  useEffect(() => {
    if (state.idType) {
      setpickId(idToIndex(state.idType));
    }
  }, [state.idType])


  const handleIdSelect = (item, index) => {
    dispatch({ type: "IDTYPE", payload: item });
    setpickId(index);
  }


  const validateForm = () => {
    if (!state.firstname || !state.lastname || !state.email || !state.dob || 
        !state.mobileNo || !state.address || !state.ssn || !state.idType || 
        !state.frontId || !state.backId || !state.password || !state.confirmPassword) {
      setMessage({ text: "Please fill all required fields.", type: "error"});
      return false;
    }
    if (state.password !== state.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error"});
      return false;
    }
    if (state.ssn.length !== 11) {
      setMessage({ text: "Please enter a valid SSN (XXX-XX-XXXX format).", type: "error"});
      return false;
    }
    if (state.mobileNo.length !== 10) {
      setMessage({text: "Please enter a valid Mobile Number", type: "error"})
      return false
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('firstname', state.firstname);
    formData.append('lastname', state.lastname);
    formData.append('email', state.email);
    formData.append('dob', state.dob);
    formData.append('mobileNo', state.mobileNo);
    formData.append('address', state.address);
    formData.append('ssn', state.ssn);
    formData.append('idType', state.idType);
    formData.append('frontId', state.frontId);
    formData.append('backId', state.backId);
    formData.append('password', state.password)


    try {
      const res = await api.post("/signup-user", formData);
      if (res.data.success) {
        setMessage({ text: res.data.message, type: "success"});
        setTimeout (() => navigate("/login"), 2000);
      } else {
        setMessage({text: res.data.message, type: "error"})
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data?.message){
        setMessage({text: error.response.data.message, type: "error"})
      } else {
        setMessage({text: "Network error. Please try again", type: "error"})
      }
    } finally {
      setLoading(false);
    }
  }


  
  return (
    <div className='signup_container'>
      <form onSubmit={handleSubmit}>
        <label>Firstname</label>
        <input type="text" onChange={(e) => {dispatch({type: "FIRSTNAME", payload: e.target.value})}} placeholder='Firstname'  required />
        <label>Lastname</label>
        <input type="text" onChange={(e) => {dispatch({type: "LASTNAME", payload: e.target.value})}} placeholder='Lastname' required />
        <label>Email</label>
        <input type="email" onChange={(e) => {dispatch({type: "EMAIL", payload: e.target.value})}} placeholder='Email'  required />
        <label>DOB</label>
        <input type="date" onChange={(e) => {dispatch({type: "DOB", payload: e.target.value})}} placeholder='Dob' required/>
        <label>Mobile Number</label>
        <input type="tel" onChange={(e) => {dispatch({type: "MOBILENO", payload: e.target.value})}}  placeholder='MobileNo'  required />
        <label>Address</label>
        <input type="text" onChange={(e) => {dispatch({type: "ADDRESS", payload: e.target.value})}} placeholder='Address' required />
        <label>SSN</label>
        <input type="text" onChange={(e) => {dispatch({type: "SSN", payload: e.target.value})}} placeholder='SSN' required/>
        <div className='chose_id'>
          {ids.map((item, index) => (
            <div
              key={index}
              className={`select ${pickId === index ? "active" : ""}`}
              onClick={() => handleIdSelect(item, index)}
            >
              <label>
                <input 
                type="radio"
                checked={state.idType === item}
                onChange={(e) => {dispatch({type: "IDTYPE", payload: item})}}
                required
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        <label>Front Id Card</label>
        <input type="file" accept='image/*' capture='environment' onChange={(e) => {dispatch({type: "FRONTID", payload: e.target.files[0]})}} placeholder='FrontId' required/>
        <label>Back Id Card</label>
        <input type="file" accept='image/*' capture='environment' onChange={(e) => {dispatch({type: "BACKID", payload: e.target.files[0]})}} placeholder='BackId' required/>
        <label>Password</label>
        <div className="password_field">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      dispatch({ type: "PASSWORD", payload: e.target.value })
                    }
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
        <label>Confirm Password</label>
        <div className="password_field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) =>
                      dispatch({ type: "CONFIRMPASSWORD", payload: e.target.value })
                    }
                    placeholder="Confirm Password"
                    required
                  />
                  <span
                    className="toggle_eye"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {message.text && (
                    <p className={`form-message ${message.type}`}>
                      {message.text}
                    </p>
                )}
        <button type='submit' disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
      </form>
      <div className='login_redirect'>
        <p>Already have an account <span><NavLink to="/login">Login</NavLink></span></p>
      </div>
    </div>
  )
}

export default Signup






