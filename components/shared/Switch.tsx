'use client'
import { useState } from 'react'

const Switch = () => {
  const [isChecked, setIsChecked] = useState<boolean>()
  return (
    <div className='flex items-center'>
      <input
        type='checkbox'
        className='sr-only'
        id='checkbox'
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <label htmlFor='checkbox' className='cursor-pointer'>
        <div
          className={`w-10 h-5 ${
            !isChecked ? 'bg-[#2F27CE]' : 'bg-[#878FA4]'
          } rounded-full p-1 flex items-center`}>
          <div
            className={`w-4 h-4 bg-[#ffffff] rounded-full transition-transform transform ${
              isChecked ? 'translate-x-[-100%]' : ''
            }`}
          />
        </div>
      </label>
    </div>
  )
}

export default Switch
