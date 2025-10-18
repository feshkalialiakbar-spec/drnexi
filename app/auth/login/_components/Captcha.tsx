'use client'

import { useState, useEffect } from 'react'
import { Refresh } from 'iconsax-react'

const Captcha = ({ onSubmit }: { onSubmit: (status: boolean) => void }) => {
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
          type='text'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onSubmit(!(e.target.value.trim().toLocaleLowerCase() === answer))
          }}
          placeholder='کد امنیتی را وارد کنید'
        />
        <div className='flex min-w-40 w-fit h-10 font-serif gap-10 px-2  border rounded items-center'>
          <p className='text-2xl'>{challenge}</p>
          <Refresh
            className='cursor-pointer hover:scale-110 hover:text-primary hover:rotate-90'
            onClick={generateChallenge}
          />
        </div>
      </div>
    </div>
  )
}

export default Captcha
