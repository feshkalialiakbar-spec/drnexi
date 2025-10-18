'use client'
import HeaderSupport from './HeaderSupport'

const AuthHeader = () => {
  return (
    <header className='pt-4 pb-6 sm:pb-8 lg:pb-12'>
      <div className='flex justify-end'>
        <HeaderSupport />
      </div>
    </header>
  )
}

export default AuthHeader
