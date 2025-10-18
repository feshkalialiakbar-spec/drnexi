'use client'

import { useState, useEffect } from 'react'
import { Refresh } from 'iconsax-react'

const Captcha = ({ setResult }: { setResult: (status: boolean) => void }) => {
  const [inputValue, setInputValue] = useState('')
  const [challenge, setChallenge] = useState('')
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    generateChallenge()
  }, [])

  const generateChallenge = () => {
    const s = 'abcdefghijkmnopqrstuvwxyz123456789'
    const secret = Array(5)
      .join()
      .split(',')
      .map(function () {
        return s.charAt(Math.floor(Math.random() * s.length))
      })
      .join('')
    setChallenge(secret)
    setAnswer(secret)
  }

  return (
    <div className='flex-col w-100dwv h-100dvh justify-center items-center'>
      <p className='text-slate-600'>کد امنیتی</p>
      <div className='flex gap-6'>
        <input
          className='border rounded w-full h-10 px-2'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setResult(e.target.value.trim() === answer)
          }}
          placeholder='کد امنیتی را وارد کنید'
        />
        <div className='flex min-w-40 w-fit h-10 font-[fantasy] gap-10 px-2  border rounded items-center'>
          <p className='text-2xl'>{challenge}</p>
          <Refresh
            size={28}
            color='#7f0fe0'
            className='cursor-pointer hover:scale-110 hover:text-primary hover:rotate-90'
            onClick={generateChallenge}
          />
        </div>
      </div>
    </div>
  )
}

export default Captcha
