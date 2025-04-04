import React, { useState, useRef, useCallback } from 'react'

import { validateEmail } from '../utils/validators.js'
import API from '../config/api.config.js'
import Overlay from '../components/Overlay.jsx'
import backgroundImg from '../../public/images/Background.png'
import logo from '../assets/images/Icon.png'
import loginImg from '../assets/images/BWLogo.svg'
import PhoneOTPInput from '../components/PhoneOTPInput.jsx'
import { resetPassword } from '../services/apiService.js'

function ForgotPassword(params) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [towStepVerification, setTwoStepVerification] = useState(false)
  const debounceTimeout = useRef(null)

  const validateForm = {
    email: (value) => {
      if (!value) return 'Email is required'
      if (!validateEmail(value)) return 'Invalid email format'
      return ''
    },
    password: (value) => {
      if (!value) return 'Password is required'
      if (value.length < 6) return 'Password must be at least 6 characters'
      return ''
    },
  }

  const validateField = useCallback(
    (name, value) => {
      if (
        validateForm.hasOwnProperty(name) &&
        typeof validateForm[name] === 'function'
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateForm[name](value),
        }))
      } else {
        console.error(`Validation function not found for field: ${name}`)
      }
    },
    [validateForm],
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))

    clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      validateField(name, value)
    }, 300) // 300ms debounce
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formIsValid = true
    const newErrors = {}

    Object.keys(formData).forEach((fieldName) => {
      const error = validateForm[fieldName](formData[fieldName])
      newErrors[fieldName] = error
      if (error) formIsValid = false
    })

    setErrors(newErrors)

    if (!formIsValid) return
    const response = await resetPassword({})
    try {
    } catch (error) {}

    setLoading(true)

    setTimeout(() => {
      alert('Login successful')
      setLoading(false)
      setFormData({ email: '', password: '' })
      setTwoStepVerification(true)
    }, 1000)
  }
  //Function to check if the form is valid.
  const isFormValid = () => {
    let isValid = true
    Object.keys(formData).forEach((fieldName) => {
      if (validateForm[fieldName](formData[fieldName])) {
        isValid = false
      }
    })
    return isValid
  }
  return (
    <>
      <div
        className="flex min-h-screen items-center justify-end relative md:p-[6rem]   z-20 bg-black  "
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',

          backgroundPosition: '50% -50%',
        }}
      >
        <div className="bg-white p-8 rounded-[30px] shadow-lg max-w-[45.625rem] min-h-[27.5rem] w-full flex flex-col md:flex-row items-center absolute ">
          {/* Left Side - Logo and Image */}
          <div className="flex flex-col items-center  md:w-1/2 ">
            <a href="#" className="w-[182px] h-[87px] mb-8">
              <img src={logo} alt="" className="h-full w-full" />
            </a>
            {/* <p className="text-[20px]  font-[400] mt-2">Agent Log In</p> */}
            <img
              src={loginImg}
              alt="Tripzite Logo"
              className="w-40 h-52 mt-4 rounded-lg shadow-md "
            />
          </div>
          <div className="md:w-1/1.5 w-full pl-6">
            <h2 className="text-[2rem] font-[400] text-gray-800 mb-6 ">
              Forgot Password?
            </h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-[2rem]">
                <input
                  type="text"
                  name="email"
                  placeholder="*Enter your Email"
                  autoComplete="email"
                  //   className={`w-full p-3 border rounded-[1rem]  text-[0.75rem] font-[400] focus:ring-2 focus:ring-green-500 outline-none ${
                  //     errors.email ? 'border-red-500' : ''
                  //   }`}
                  className={`w-full p-2 border rounded-[1.2rem]  text-[0.75rem] font-[400] focus:border-green-500 outline-none  mb-3`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              {/* <div className="mb-[2rem]">
                    <input
                      type="password"
                      name="password"
                      placeholder="*Password"
                      autoComplete="new-password"
                      className={`w-full p-3 border rounded-[1rem] text-[0.75rem] font-[400] focus:ring-2 focus:ring-green-500 outline-none ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div> */}
              <button
                type="submit"
                className={`w-full p-2 rounded-[1.2rem] text-[0.75rem] font-[400] transition ${
                  loading || !isFormValid()
                    ? 'bg-black text-white cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Logging in...' : 'Send Password Reset Link'}
              </button>
              <div className="flex justify-end items-center mt-4 text-sm">
                <a href="#" className="text-blue-500 hover:underline">
                  Return To Log In Page
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default ForgotPassword
