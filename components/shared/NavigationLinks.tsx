'use client'
import { usePathname } from 'next/navigation'
import { EmptyWallet, People, Profile, TransactionMinus } from 'iconsax-react'
import { useStates } from '@/Context'
import { useEffect, useState } from 'react'
import { getCookieByKey } from '@/actions/cookieToken'

const NavigationLinks = () => {
  const path = usePathname()
  const { permissions } = useStates()
  const [roleCount, setRoleCount] = useState<number>(0)
  useEffect(() => {
    const getData = async () => {
      setRoleCount(parseInt(`${await getCookieByKey('role_count')}`))
    }
    getData()
  }, [])
  return (
    <footer
      className={`fixed flex justify-center py-2  bottom-0 start-0  w-full z-10 bg-white`}>
      <ul className='flex items-center px-5 justify-between max-w-[888px] w-full'>
        {permissions[0]?.includes('115') && (
          <li>
            <button
              className='flex flex-col text-center items-center gap-1 !rounded-lg'
              onClick={() => (location.href = `/wallet`)}>
              <EmptyWallet
                size='24'
                color={path.includes('/wallet') ? '#2F27CE' : '#2f27ce80'}
              />
              <span
                className={`text-xs sm:text-sm lg:text-base ${
                  path.includes('/wallet') ? 'text-primary' : 'text-primary/50'
                }`}>
                کیف پول
              </span>
            </button>
          </li>
        )}
        {roleCount > 1 && (
          <li>
            <button
              className='flex flex-col text-center items-center gap-1 !rounded-lg'
              onClick={() => (location.href = '/change-wallet')}>
              <EmptyWallet
                size='24'
                color={
                  path.includes('/change-wallet') ? '#2F27CE' : '#2f27ce80'
                }
              />
              <span
                className={`text-xs sm:text-sm lg:text-base ${
                  path.includes('/change-wallet')
                    ? 'text-primary'
                    : 'text-primary/50'
                }`}>
                کیف پول های دیگر
              </span>
            </button>
          </li>
        )}
        {permissions[0]?.includes('114') && (
          <li>
            <button
              className='flex flex-col text-center items-center gap-1 !rounded-lg'
              onClick={() => (location.href = `/reports`)}>
              <TransactionMinus
                size='24'
                color={path.includes('/reports') ? '#2F27CE' : '#2f27ce80'}
              />
              <span
                className={`text-xs sm:text-sm lg:text-base ${
                  path.includes('/reports') ? 'text-primary' : 'text-primary/50'
                }`}>
                گزارش‌ها
              </span>
            </button>
          </li>
        )}
        {permissions[0]?.includes('106') && (
          <li>
            <button
              className='flex flex-col text-center items-center gap-1 !rounded-lg'
              onClick={() => (location.href = `/clerk`)}>
              <People
                size='24'
                color={path.includes('/clerk') ? '#2F27CE' : '#2f27ce80'}
              />
              <span
                className={`text-xs sm:text-sm lg:text-base ${
                  path.includes('/clerk') ? 'text-primary' : 'text-primary/50'
                }`}>
                دستیار
              </span>
            </button>
          </li>
        )}
        {permissions[0]?.includes('113') && (
          <li>
            <button
              className='flex flex-col text-center items-center gap-1 !rounded-lg'
              onClick={() => (location.href = `/profile`)}>
              <Profile
                size='24'
                color={path.includes('/profile') ? '#2F27CE' : '#2f27ce80'}
              />
              <span
                className={`text-xs sm:text-sm lg:text-base ${
                  path.includes('/profile') ? 'text-primary' : 'text-primary/50'
                }`}>
                پروفایل
              </span>
            </button>
          </li>
        )}
      </ul>
    </footer>
  )
}

export default NavigationLinks
