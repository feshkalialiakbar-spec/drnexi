'use client'

import QRCode from 'react-qr-code'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowRight2, Printer, Share } from 'iconsax-react'
import { IUserResponse } from '@/interfaces'

interface IProps {
  user: IUserResponse
}

const ProfileShowQRCode = ({ user }: IProps) => {
  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false)
  const handleShare = async () => {
    if (!html2canvasLoaded) {
      const html2canvas = await import('html2canvas')
      setHtml2canvasLoaded(true)

      const element = document.getElementById('capture')
      if (!element) {
        console.error('Element to capture not found.')
        return
      }

      const canvas = await html2canvas.default(element)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create Blob from canvas.')
          return
        }

        if (navigator.share) {
          try {
            const file = new File([blob], 'receipt.png', { type: 'image/png' })
            await navigator.share({
              files: [file],
              title: 'رسید تراکنش',
              text: 'رسید تراکنش',
            })
            setHtml2canvasLoaded(false)
          } catch (error) {
            setHtml2canvasLoaded(false)
            console.error('Error sharing receipt:', error)
          }
        } else {
          toast.error('دستگاه شما از قابلیت اشتراک گذاری پشتیبانی نمی‌کند.')
        }
      })
    }
  }

  return (
    <div className='flex flex-col justify-between min-h-[75vh] gap-20'> 
     <div className="">
       <button
        className='!font-medium !text-primary !flex !items-center !gap-2 !mb-8 lg:!mb-10 !rounded-lg'
        onClick={() =>
          (location.href = `/profile`)
        }>
        <ArrowRight2 size='24' color='#2f27ce' />
        کد QR
      </button>
      <div className='flex items-center flex-col rounded-2xl bg-sky-100 p-6'>
        <Image
          src={'/images/sample-avatar.jpg'}
          alt={user?.full_name || ''}
          title={user?.full_name || ''}
          width={64}
          height={64}
          className='block rounded-full mb-3'
        />
        <p className='font-medium'>{user?.full_name || ''}</p>

        <div className='flex items-center justify-center mt-2 mb-3 overflow-hidden rounded-md'>
          <div id='capture' className='p-4'>
            <QRCode
              value='https://hesab.link'
              size={140}
              bgColor='transparent'
              fgColor='#2F27CE'
            />
          </div>
        </div>

        <p className='flex items-center gap-2'>
          <Printer size='24' color='#2f27ce' />
          می‌توانید کد QR را چاپ کنید.
        </p>
      </div>
      </div>
      <button
          className=' w-full flex justify-center items-center h-10 gap-4 rounded-lg border-button'
          onClick={handleShare}>
          <Share size='24' color='#2f27ce' />
          <p>اشتراک گذاری</p>
        </button>
    </div>
  )
}

export default ProfileShowQRCode
