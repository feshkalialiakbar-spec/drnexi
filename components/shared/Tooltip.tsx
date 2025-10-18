import React from 'react'

interface TooltipProps {
  text: string
  isHovered: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ text, isHovered }) => {
  return (
    <div className='relative'>
      {isHovered && (
        <div className='absolute left-2 max-md:left-10 transform -translate-x-1/2 bottom-[-40px] bg-gray-600 text-white text-sm py-1 px-3 rounded shadow-md z-10'>
          <span>{text}</span>
        </div>
      )}
    </div>
  )
}

export default Tooltip
