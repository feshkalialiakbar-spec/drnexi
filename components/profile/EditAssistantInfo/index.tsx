'use client'
import Calendar from '@/components/shared/Calendar'
import Header from '@/components/shared/Header'
import { getAccessToken } from '@/hooks/getAccessToken'
import { IUserResponse } from '@/interfaces'
import { GetCurrentUser } from '@/services/user'
import { AddSquare, ArrowRight2 } from 'iconsax-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const EditAssistantInfo = () => {
  const filterRefs = useRef({
    name: '',
    last_name: '',
    image: '',
  })

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null) // وضعیت تصویر پروفایل

  const [data, setData] = useState<{
    accessToken: string
    user: IUserResponse
  }>()

  const getToken = useCallback(async () => {
    const accessToken = await getAccessToken()
    const user = await GetCurrentUser({ accessToken })
    user &&
      setData({
        accessToken: accessToken || '',
        user,
      })
  }, [setData])
  useEffect(() => {
    !data && getToken()
  }, [getToken, data])
  useEffect(() => {
    const storedAvatar = localStorage.getItem('avatarUrl')
    if (storedAvatar) {
      setCurrentAvatarUrl(storedAvatar) // بارگذاری تصویر جدید
    } else {
      // setCurrentAvatarUrl(data?.user?.avatarUrl) //در صورت عدم وجود تصویر ذخیره‌شده، تصویر پیش‌فرض
    }
  }, [getToken, data])

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] // گرفتن فایل انتخاب شده
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const newAvatarUrl = reader.result as string // تصویر جدید
        setCurrentAvatarUrl(newAvatarUrl) // به‌روزرسانی تصویر پروفایل
        // const response = await UserImage({ source: newAvatarUrl, accessToken })
      }
      reader.readAsDataURL(file) // تبدیل به Base64
    }
  }
  return (
    <>
      <Header />
      <div
        className='flex text-primary mb-8 gap-3'
        onClick={() =>
          (location.href = `/profile`)
        }>
        <ArrowRight2 />
        <b> ویرایش</b>
      </div>

      <form className='space-y-4 min-h-[80vh] flex flex-col justify-between items-center'>
        <div className='w-[90%]'>
          <div className='flex items-center justify-center'>
            <Image
              src={currentAvatarUrl || '/images/logo.jpg'} // استفاده از تصویر جدید
              alt={data?.user.full_name || ''}
              title={data?.user.full_name}
              width={64}
              height={64}
              className='block rounded-full'
            />

            <div className='absolute mt-[8vh] ml-[7vh]'>
              <label htmlFor='avatarUpload' className='cursor-pointer'>
                <AddSquare
                  size='25'
                  color='white'
                  style={{ fill: '#125AE3' }}
                  className='rounded-full border-none'
                />
              </label>
              <input
                id='avatarUpload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className='flex-col flex gap-1'>
            <label id='payer-name-label'>نام </label>
            <input
              id='payer_name'
              type='text'
              placeholder='علی '
              className='w-full !rounded-lg'
              defaultValue={filterRefs.current.last_name}
              onChange={(e) => (filterRefs.current.last_name = e.target.value)}
            />
          </div>

          <div className='flex-col flex gap-1'>
            <label id='payer-name-label'> نام خانوادگی</label>
            <input
              id='payer_name'
              type='text'
              placeholder=' اکبری'
              className='w-full !rounded-lg'
              defaultValue={filterRefs.current.last_name}
              onChange={(e) => (filterRefs.current.last_name = e.target.value)}
            />
          </div>
        </div>

        <div className='flex gap-4 justify-center sticky b-1 w-[80%]'>
          <button
            className='!px-7 !py-3 !min-w-0 !rounded !bg-primary !text-white w-full my-7'
            type='submit'>
            تایید و دخیره
          </button>
        </div>
      </form>
    </>
  )
}

export default EditAssistantInfo
