'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DisableAssistant,
  EnableAssistant,
  GetAssistantList,
  IAssistantList,
} from '@/services/clerk'
import { ProfileDelete } from 'iconsax-react'
import { useClerkShowDeleteBtn } from '@/hooks/useClerkHooks'
import toast from 'react-hot-toast'
import { useStates } from '@/Context'

interface IProps {
  accessToken: string | undefined
}

const ClerkList = ({ accessToken }: IProps) => {
  const [assistants, setAssistants] = useState<IAssistantList[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const { permissions } = useStates()
  const { showDeleteButtons } = useClerkShowDeleteBtn()

  const fetchData = useCallback(async () => {
    const assistantList = await GetAssistantList({ accessToken })
    assistantList && setAssistants(assistantList)
  }, [accessToken])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleAssistantStatus = async (phone: string, status: string) => {
    if (status === 'ACTIVE') {
      await DisableAssistant({
        assistant_id: phone,
        accessToken,
      })
      toast.success(`دستیار به شماره ${phone} با موفقیت غیر فعال شد`)
    } else {
      await EnableAssistant({
        assistant_id: phone,
        accessToken,
      })
      toast.success(`دستیار به شماره ${phone} با موفقیت فعال شد`)
    }
    fetchData()
  }

  return (
    <>
      {permissions[1]?.includes('773') && (
        <>
          {showDeleteModal && (
            <div>
              <div className='border border-red-500 p-6 absolute bottom-[10vh] left-0 right-0 w-full sm:mx-auto sm:max-w-[550px] sm:rounded-t-2xl'>
                <p className='text-center'>
                  آیا از حذف <b></b> اطمینان دارید؟
                </p>
                <div className='flex gap-6 mt-6 sm:mt-8'>
                  <div className='flex-1'>
                    <button className='!bg-red-600 !text-white w-full !rounded-lg'>
                      حذف
                    </button>
                  </div>
                  <div className='flex-1'>
                    <button
                      className='!border-primary !text-primary w-full !rounded-lg'
                      onClick={() => setShowDeleteModal(false)}>
                      انصراف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {assistants?.length ? (
            assistants.map((assistant, index) => (
              <div
                key={index}
                className='flex justify-between items-center mb-6 last-of-type:mb-0 my-6'>
                <div className='flex items-center gap-3'>
                  {showDeleteButtons && (
                    <button
                      className='!bg-red-600 !text-white !min-w-10 !px-0 !rounded-lg'
                      // onClick={() => onDelete(username)}
                    >
                      <ProfileDelete fontSize='small' />
                    </button>
                  )}
                  <p>
                    <span className='block font-medium mb-1'>
                      {assistant?.mobile}
                    </span>
                    {assistant?.lastlogin_time && (
                      <span className='block text-xs text-zinc-600 font-light'>
                        <span dir='ltr'>{assistant?.full_name}</span>
                      </span>
                    )}
                  </p>
                </div>
                <div onClick={() => 'alert(assistant.full_name)'}>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      className='sr-only'
                      id={`checkbox-${index}`}
                      checked={assistant?.status === 'ACTIVE'}
                      onChange={() =>
                        toggleAssistantStatus(
                          assistant?.mobile,
                          assistant?.status
                        )
                      }
                    />
                    <label
                      htmlFor={`checkbox-${index}`}
                      className='cursor-pointer'>
                      <div
                        className={`w-10 h-5 ${
                          assistant?.status === 'ACTIVE'
                            ? 'bg-[#2F27CE]'
                            : 'bg-[#878FA4]'
                        } rounded-full p-1 flex items-center`}>
                        <div
                          className={`w-4 h-4 bg-[#ffffff] rounded-full transition-transform transform ${
                            assistant?.status !== 'ACTIVE'
                              ? 'translate-x-[-100%]'
                              : ''
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>هنوز دستیاری اضافه نشده است.</p>
          )}
        </>
      )}
    </>
  )
}

export default ClerkList
