'use client'
import React, { useEffect, useState } from 'react'

interface CircularProgressProps {
  colorTheme?: { quarter: string; half: string; thirdQuarter: string }
  time?: number
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  colorTheme,
  time = 1200,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(time)
  const [percentage, setPercentage] = useState<number>(100)
  const [color, setColor] = useState<string>('#0F973D')
  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1
        setPercentage((newTimeLeft / time) * 100)
        return newTimeLeft
      })
      if (percentage >= 70 && percentage <= 80)
        setColor(colorTheme?.quarter || '#B17E1D')
      if (percentage >= 50 && percentage <= 60)
        setColor(colorTheme?.half || '#ebd726')
      if (percentage >= 20 && percentage <= 30)
        setColor(colorTheme?.thirdQuarter || '#D42620')
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, time,colorTheme,percentage])

  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div style={{ width: '120px', height: '120px', position: 'relative' }}>
      <svg width='120' height='120'>
        <circle
          stroke='#e6e6e6'
          fill='transparent'
          strokeWidth='5'
          r={radius}
          cx='60'
          cy='60'
        />
        <circle
          stroke={color}
          fill='transparent'
          strokeWidth='5'
          r={radius}
          cx='60'
          cy='60'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          style={{
            transition: 'stroke-dashoffset 1s linear',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
          color,
        }}>
        {new Date(timeLeft * 1000).toISOString().split('T')[1].split('.')[0].replaceAll('00:' ,'')}
      </div>
    </div>
  )
}

export default CircularProgress
