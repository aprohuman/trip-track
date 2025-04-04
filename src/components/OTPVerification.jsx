import React, { useState, useRef, useEffect } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { verifyOneTimePassword } from '../services/apiService'
const OTPVerification = ({ currentStep, setCurrentStep, otpData }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (e, index) => {
    const value = e.target.value
    console.log('ptp--', value)
    if (isNaN(value)) return

    let newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }
  console.log('oo', otp)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setResendTimer(30)
      toast.success('OTP resent successfully!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Convert OTP array to a string
    const otpString = otp.join('')

    // Early validation check for OTP length
    if (otpString.length !== 6) {
      alert('Please enter a valid 6-digit OTP')
      return
    }

    // Prepare OTP data for API call
    const enteredOtpData = { otp: otpString }

    try {
      // api call for verify otp
      // const response = await verifyOneTimePassword(enteredOtpData)
      alert('OTP verified successfully!')
      setCurrentStep(4)

      if (response && response.ok) {
        // Move to the next step if OTP is valid
        setCurrentStep(3)
        alert('OTP verified successfully!')
      } else {
        // Handle invalid OTP
        alert('Invalid OTP. Please try again.')
      }
    } catch (error) {
      // Improved error handling with user-friendly messages
      console.error('Error verifying OTP:', error)
      toast.error(
        'An error occurred while verifying OTP. Please try again later.',
      )
    } finally {
      // setLoading(false) // Stop loading indicator regardless of the outcome
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-bold mt-3 md:mt-4 text-center md:text-left">
        Verify OTP
      </h2>

      <div className="flex justify-center gap-2 md:gap-3 mt-3 md:mt-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl text-center border-1 border-black rounded-lg
                   focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        ))}
      </div>

      <div className="mt-2 md:mt-3 px-2">
        {resendTimer > 0 ? (
          <p className="text-xs md:text-sm text-center md:text-left text-gray-600">
            Resend OTP in {resendTimer} seconds
          </p>
        ) : (
          <p className="text-xs md:text-sm text-center md:text-right text-blue-600 hover:text-blue-700 cursor-pointer">
            Resend OTP
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-3 md:py-2 mt-3 md:mt-4 rounded-lg
             hover:bg-gray-800 text-sm md:text-base transition-colors"
      >
        Confirm
      </button>
    </div>
  )
}

export default OTPVerification
