'use client'
import { ArrowLeft2, Key } from 'iconsax-react'

const ProfileChangePassword = () => {
  return (
    <button
      className='!flex !text-primary !justify-between !items-center !w-full !mb-8 sm:!mb-10 !rounded-lg'
      onClick={() =>
        (location.href = `/${
          location.pathname.split('/')[1]
        }/profile/change-password`)
      }>
      <p className='flex items-center gap-2'>
        <Key size='24' color='#2f27ce' />
        <span className='font-medium'>تغییر رمز عبور</span>
      </p>
      <ArrowLeft2 size='24' color='#2f27ce' />
    </button>
  )
}

export default ProfileChangePassword
