'use client'
import React, { useState, useRef, useEffect } from 'react'

interface Props {
  setResult: (otp: string) => void
}

const OTPInput: React.FC<Props> = ({ setResult }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''))
  const inputRefs = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    setResult(otp.join(''))
  }, [otp, setResult])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value

    // Only allow numeric input
    if (/^\d$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Automatically move to the next input if value is valid and it's not the last input
      if (index < 5 && value) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)

      // Move to the previous input if Backspace/Delete was pressed and it's not the first input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  return (
    <div
      className='flex justify-center w-full gap-4'
      style={{ direction: 'ltr' }}>
      {otp.map((_, index) => (
        <input
          autoFocus={index === 0}
          key={index}
          type='text'
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            if (el) inputRefs.current[index] = el
          }}
          inputMode='numeric'
          className='w-[5vw] max-md:w-[10vw] h-[5vw] max-md:h-[10vw] text-center'
        />
      ))}
    </div>
  )
}

export default OTPInput
