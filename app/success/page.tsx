'use client'

import { useEffect } from 'react'

const Success = () => {
  useEffect(() => {
    setTimeout(
      () => (location.href = 'https://message-manager.liara.run/#success'),
      3333
    )
  }, [])
  return (
    <section className='wrapper'>
      <div className='container m-auto text-center mt-20'>
        <h2 className='text-black font-bold text-2xl md:text-3xl mb-4'>
          تراکنش موفق
        </h2>
        <h1 className='text-black font-bold text-2xl md:text-7xl mb-4'>✅</h1>
        <div className='flex justify-center gap-4 md:gap-6 mt-5 md:mt-6 font-bold'>
          عملیات با موفقیت انجام شد
        </div>
      </div>
    </section>
  )
}

export default Success
