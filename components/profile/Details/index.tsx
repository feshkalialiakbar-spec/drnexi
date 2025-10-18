'use client'
import Image from 'next/image'
import {
  ArrowLeft2,
  CloseSquare,
  Key,
  ScanBarcode,
  TableDocument,
} from 'iconsax-react'
import { useEffect, useState } from 'react'
import SelectWallet from '@/components/SelectWallet'
import { useStates } from '@/Context'
import { GetCurrentUser } from '@/services/user'
import { getCookieByKey } from '@/actions/cookieToken'
import { getAccessToken } from '@/hooks/getAccessToken'
import { IUserResponse } from '@/interfaces'

const ProfileDetails = () => {
  const [showRoles, setShowRoles] = useState<boolean>(false)
  const { permissions } = useStates()
  const [user, setUser] = useState<IUserResponse>()
  const [isAssistantWallet, setIsAssistantWallet] = useState<boolean>(false)

  useEffect(() => {
    const checkWallet = async () => {
      setIsAssistantWallet((await getCookieByKey('role_type')) === '0')
      await GetCurrentUser({ accessToken: await getAccessToken() }).then(
        (result) => result && setUser(result)
      )
    }
    checkWallet()
  }, [])
  return (
    <>
      {showRoles && permissions[1].includes('763') && (
        <div
          className={`fixed z-50 left-[20vw] top-[1vh] max-md:left-[0] max-md:w-[100%] max-md:h-[70vh] w-[60vw] h-[75vh] bg-white border border-gray-300 rounded-t-[30px] shadow-lg transition-transform duration-300 ease-in-out
       p-3 animate-slideUp 
        `}>
          <CloseSquare
            onClick={() => {
              setShowRoles(false)
              location.hash = 'dwavsh'
            }}
            color='#2f27ce'
            className='cursor-pointer'
          />
          {permissions[1].includes('763') && (
            <SelectWallet autoRedirect={false} />
          )}
        </div>
      )}
      {permissions[1].includes('780') && (
        <div className={`${showRoles && 'opacity-10'}`}>
          <div className='rounded-2xl bg-[#E2F1FC] p-5 sm:p-6 flex flex-col items-center '>
            {user?.full_name && (
              <p className='text-slate-500 mb-4'>
                شما در حال حاضر وارد کیف پول
                <b className='font-medium '>
                  {` ${user?.full_name.replace(/\b(null|undefined)\b/g, '')} `}
                </b>
                شده‌اید.
              </p>
            )}
            <div
              className={`flex w-full ${
                permissions[1].includes('763') &&
                ' max-md:flex-col max-md:gap-1 '
              } items-center justify-between`}>
              <div className='flex gap-7'>
                <Image
                  src={'/images/logo.jpg'}
                  alt={user?.full_name || ''}
                  title={user?.full_name}
                  width={64}
                  height={64}
                  className='block rounded-full object-contain'
                />
                <div className='flex flex-col justify-center'>
                  <p>{user?.full_name.replace(/\b(null|undefined)\b/g, '')}</p>
                  <p className='text-bold text-primary'>{user?.mobile}</p>
                </div>
              </div>
              <div className='flex gap-3'>
                {permissions[1].includes('763') && (
                  <div
                    className='flex text-primary  gap-3 cursor-pointer'
                    onClick={() => {
                      setShowRoles(true)
                      location.hash = 'nvdwavshoh'
                    }}>
                    ورود به حساب‌های دیگر
                    <ArrowLeft2 />
                  </div>
                )}
                {!permissions[1].includes('763') && (
                  <div
                    className='!rounded-lg cursor-pointer'
                    onClick={() => (location.href = `/profile/qr`)}>
                    <ScanBarcode size='32' color='#2f27ce' />
                  </div>
                )}
              </div>
            </div>
          </div>
          {isAssistantWallet && (
            <div className='flex px-2  my-10 justify-between cursor-pointer text-[#2f27ce]'>
              <div
                className='flex align-center justify-between'
                style={{ width: '95%' }}
                onClick={() => (location.href = `/profile/qr`)}>
                <p className='mr-2'> کد QR </p>
              </div>
              <ScanBarcode />
            </div>
          )}
          {/* {[`${process.env.NEXT_PUBLIC_SECRETARY_ROLE}`].includes(role) && (
          <div className='flex px-2  my-10 justify-between cursor-pointer text-[#2f27ce]'>
            <UserEdit />
            <div
              className='flex align-center justify-between'
              style={{ width: '95%' }}
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-info`)
              }>
              <p className='mr-2'> اطلاعات کاربری </p>
              <ArrowLeft2 />
            </div>
          </div>
        )} */}
          {/* {role !== `${process.env.NEXT_PUBLIC_SECRETARY_ROLE}` && (
          <div className='flex p-2 my-10 justify-between cursor-pointer text-[#2f27ce]'>
            <Profile />
            <div
              className='flex align-center justify-between'
              style={{ width: '95%' }}
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-account`)
              }>
              <p className='mr-2'> حساب کاربری </p>
              <ArrowLeft2 />
            </div>
          </div>
        )} */}
          {permissions[1]?.includes('709') && (
            <div className='flex p-2 mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'>
              <TableDocument />
              <div
                className='flex align-center justify-between'
                style={{ width: '95%' }}
                onClick={() =>
                  (location.href = `/profile/cooperation-in-sale`)
                }>
                <p className='mr-2'>
                  {true ? 'دعوت از مشتریان' : 'دعوت از دوستان '}
                </p>
                <ArrowLeft2 />
              </div>
            </div>
          )}
          <div className='flex p-2 mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'>
            <Key />
            {permissions[1]?.includes('777') && (
              <div
                className='flex align-center justify-between'
                style={{ width: '95%' }}
                onClick={() => (location.href = `/profile/change-password`)}>
                <p className='mr-2'>تغییر رمز عبور</p>
                <ArrowLeft2 />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileDetails
