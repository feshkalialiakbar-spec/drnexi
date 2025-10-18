'use client'
import { useEffect, useState } from 'react'

const ShowAnimateNumber = ({
  startValue,
  targetValue,
  incrementValue,
  interval = 1,
}: {
  startValue: number
  targetValue: number
  incrementValue: number
  interval: number
}) => {
  const [currentValue, setCurrentValue] = useState(startValue)
  const [previousValue, setPreviousValue] = useState(startValue)

  useEffect(() => {
    if (currentValue !== targetValue) {
      const timer = setInterval(() => {
        setPreviousValue(currentValue)
        setCurrentValue((prev) => {
          if (prev > targetValue) {
            return Math.max(prev - 10000, targetValue)
          } else {
            return Math.min(prev + incrementValue, targetValue)
          }
        })
      }, interval)

      return () => clearInterval(timer)
    }
  }, [currentValue, targetValue, interval, incrementValue])

  const currentValueString = currentValue.toLocaleString('en-US')

  return (
    <div style={{ direction: 'ltr' }}>
      <p>
        {currentValueString.split('').map((digit, index) => (
          <span key={index}>{digit.split('.')[0]}</span>
        ))}
      </p>
    </div>
  )
}

export default ShowAnimateNumber
