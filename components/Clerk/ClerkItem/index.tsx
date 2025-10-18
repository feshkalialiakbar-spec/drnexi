'use client'

import { useState } from 'react'
import { useClerkShowDeleteBtn } from '@/hooks/useClerkHooks'
import { DisableAssistant, EnableAssistant } from '@/services/clerk'
import toast from 'react-hot-toast'
import { revalidateDataByTag } from '@/services/shared'
import { ProfileDelete } from 'iconsax-react'

interface IClerkItem {
  index:number
  username: string
  activeUntil: string
  mobileNumber: string
  accessToken: string | undefined
  onDelete: (data: string) => void
  isActive: boolean
  setIsActive: (data: boolean) => void
}

const ClerkItem = ({
  username,
  activeUntil,
  onDelete,
  mobileNumber,
  accessToken,
  isActive,setIsActive
}: IClerkItem) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { showDeleteButtons } = useClerkShowDeleteBtn()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fetchData = async () => {
      if (event.target.checked === true) {
        setLoading(true)
        const response = await EnableAssistant({
          assistant_id: mobileNumber,
          accessToken,
        })
        if (!response) {
          setLoading(false)
          toast.error('خطایی رخ داد! مجددا تلاش کنید.')
          return
        }
        if (response.status === '-1') {
          setLoading(false)
          toast.error(response.message)
          return
        }
        if (response.status === '1') {
          setLoading(false)
          revalidateDataByTag({ tag: 'assistant_list' })
          toast.success('دستیار با موفقیت فعال شد.')
          return true
        }
      }

      if (event.target.checked === false) {
        setLoading(true)
        const response = await DisableAssistant({
          assistant_id: mobileNumber,
          accessToken,
        })
        if (!response) {
          setLoading(false)
          toast.error('خطایی رخ داد! مجددا تلاش کنید.')
          return
        }
        if (response.status === '-1') {
          setLoading(false)
          toast.error(response.message)
          return
        }
        if (response.status === '1') {
          setLoading(false)
          revalidateDataByTag({ tag: 'assistant_list' })
          toast.success('دستیار با موفقیت غیر فعال شد.')
          return true
        }
      }
    }

    fetchData()
  }

  return (
    <>
      <div className='flex justify-between items-center mb-6 last-of-type:mb-0'>
        <div className='flex items-center gap-3'>
          {showDeleteButtons && (
            <button
              className='!bg-red-600 !text-white !min-w-10 !px-0 !rounded-lg'
              onClick={() => onDelete(username)}>
              <ProfileDelete fontSize='small' />
            </button>
          )}
          <p>
            <span className='block font-medium mb-1'>{username}</span>
            {activeUntil && (
              <span className='block text-xs text-zinc-600 font-light'>
                آخرین ورود: <span dir='ltr'>{activeUntil}</span>
              </span>
            )}
          </p>
        </div>
        {/* <Switch setIsChecked={setIsActive} isChecked={isActive} /> */}
      </div>
    </>
  )
}

export default ClerkItem








// import React, { useState } from 'react';
// import Switch from './Switch';

// const ParentComponent = () => {
//   // Initialize an array of switch states (e.g., with 5 switches all set to false initially)
//   const [switchStates, setSwitchStates] = useState([false, false, false, false, false]);

//   // Handler to toggle a specific switch by its index
//   const handleToggle = (index: number, isChecked: boolean) => {
//     const updatedStates = [...switchStates];
//     updatedStates[index] = isChecked; // Update the specific switch state
//     setSwitchStates(updatedStates);   // Set the updated array
//   };

//   return (
//     <div className="p-4">
//       <h1>Custom Switches</h1>
//       {switchStates.map((isChecked, index) => (
//         <div key={index} className="my-4">
//           <Switch 
//             isChecked={isChecked} 
//             setIsChecked={(newState) => handleToggle(index, newState)} 
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ParentComponent;
