'use client'
import { usePathname } from 'next/navigation'
import { CardPos, ConvertCard, People, Profile2User } from 'iconsax-react'

const NavigationLinks = () => {
  const path = usePathname()

  return (
    <footer
      className={`fixed flex justify-center py-2  bottom-0 start-0  w-full z-10 bg-white`}>
      <ul className='flex items-center px-5 justify-between max-w-[888px] w-full'>
        <li>
          <button
            className={`flex flex-col text-center items-center gap-1 !rounded-lg ${path.includes('/activation') &&' bg-[#ECF2FF]'} p-2`}
              onClick={() => (location.href = `/activation`)}>
            <Profile2User
              size='32'
              color={path.includes('/activation') ? '#2F27CE' : '#2f27ce80'}
            />
          </button>
        </li>
        <li>
          <button
            className={`flex flex-col text-center items-center gap-1 !rounded-lg ${path.includes('/user-management') &&' bg-[#ECF2FF]'} p-2`}
            onClick={() => (location.href = '/user-management')}>
            <People
              size='32'
              color={
                path.includes('/user-management') ? '#2F27CE' : '#2f27ce80'
              }
            />
          </button>
        </li>
        <li>
          <button
            className={`flex flex-col text-center items-center gap-1  ${path.includes('/pos') &&' bg-[#ECF2FF]'} p-2 rounded-full`}
            onClick={() => (location.href = `/pos`)}>
            <CardPos
              size='32'
              color={path.includes('/pos') ? '#2F27CE' : '#2f27ce80'}
            />
          </button>
        </li>

        <li>
          <button
            className={`flex flex-col text-center items-center gap-1 !rounded-lg ${path.includes('/system-action') &&' bg-[#ECF2FF]'} p-2`}
            onClick={() => (location.href = `/system-action`)}>
            <ConvertCard
              size='32'
              color={path.includes('/system-action') ? '#2F27CE' : '#2f27ce80'}
            />
          </button>
        </li>
      </ul>
    </footer>
  )
}

export default NavigationLinks
