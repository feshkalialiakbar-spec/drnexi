'use client'

import { deleteAllCookies } from '@/actions/cookieToken'
import { LogoutCurve } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ProfileLogout = () => {
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)

  const logoutHandler = () => {
    const deleteCookies = async () => {
      await deleteAllCookies()
      router.push(process?.env?.NEXT_PUBLIC_APP_URL || '/')
      toast.success('با موفقیت خارج شدید !')
      return true
    }

    deleteCookies()
  }
  // const [isVisible, setIsVisible] = useState(false)

  // useEffect(() => {
  //   setIsVisible(true)
  // }, [])
  return (
    <div>
      {showLogoutModal ? (
        <>
          <div
            className={` bg-slate-900 z-20 opacity-50 w-[100vw] h-[100vh] left-0 top-[0px] absolute`}></div>
          <div className={`${
              showLogoutModal ? 'animate-logout' : ''
            } bg-white p-6 absolute w-[93%] bottom-24 max-w-[880px] rounded z-30`}>
            <p className='text-center font-medium text-primary'>
              آیا می‌خواهید از حساب کاربری خود خارج شوید؟
            </p>
            <div className='flex gap-6 mt-6 sm:mt-8'>
              <div className='flex-1'>
                <button
                  className='fill-button w-full  h-10 rounded-lg'
                  onClick={() => setShowLogoutModal(false)}>
                  انصراف
                </button>
              </div>
              <div className='flex-1'>
                <button
                  className='border border-red-600 h-10 text-red-500 w-full !rounded-lg'
                  onClick={logoutHandler}>
                  خروج
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            className='border border-red-500 items-center justify-center h-10 text-red-500 w-full !rounded-lg gap-3 flex '
            style={{ zIndex: '999' }}
            onClick={() => setShowLogoutModal(true)}>
            <LogoutCurve size='24' color='#ef4444' />
            خروج از حساب کاربری
          </button>
        </>
      )}
    </div>
  )
}

export default ProfileLogout
