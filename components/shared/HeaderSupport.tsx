import React, { useState, useRef, useEffect } from 'react'
import { MessageQuestion } from 'iconsax-react'
import Tooltip from './Tooltip'
import SupportModal from './SupportModal'
import { getCookieByKey } from '@/actions/cookieToken'

const HeaderSupport = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [showPopUp, setShowPopUp] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const modalRef = useRef<HTMLDivElement>(null)

  const handleMouseOver = () => setIsHovered(true)
  const handleMouseOut = () => setIsHovered(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowPopUp(false)
    }
  }
  const checkAuth = async () => {
    const result = await getCookieByKey('access_token')
    result && setIsAuthenticated(true)
  }
  useEffect(() => {
    checkAuth()
    if (showPopUp) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPopUp])

  return (
    <div className='relative flex justify-center items-center'
    onClick={() => setShowPopUp(!showPopUp)}
    >
            <p className='text-[#2F27CE] text-[12px] mx-1'>پشتیبانی</p>
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className='cursor-pointer'>
        <MessageQuestion
          size='28'
          color='#2F27CE'
        />
      </div>

      <Tooltip text='پشتیبانی' isHovered={isHovered} />

      {showPopUp && (
        <>
          <div className='bg-slate-900 z-20 opacity-50 w-[100vw] h-[100vh] left-0 top-[0px] fixed'></div>
          <div ref={modalRef}>
            <SupportModal isAuthenticated={isAuthenticated} />
          </div>
        </>
      )}
    </div>
  )
}

export default HeaderSupport
