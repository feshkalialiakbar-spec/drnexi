'use client'

import { useStates } from '@/Context'
import { Add } from 'iconsax-react'

const ClerkActions = () => {
const {permissions}= useStates()
  return (
    <div className='flex gap-4 justify-end items-center mb-8 lg:mb-10'>
      {/* <Edit2 color='#2F27CE' className='border-2 cursor-pointer border-[#2F27CE] rounded h-10 w-10 p-2'/> */}
      {permissions[1]?.includes('772')&&<button
        className='fill-button min-w-40 flex justify-center items-center rounded h-10'
        onClick={() =>
          (location.href = `/clerk/add`)
        }>
        <Add className='me-1' fontSize='small' />
        افزودن
      </button>}
      
    </div>
  )
}

export default ClerkActions
