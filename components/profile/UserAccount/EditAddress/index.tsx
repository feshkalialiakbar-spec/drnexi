'use client'
import Header from '@/components/shared/Header'
import {
  ArrowLeft2,
  ArrowRight2,
  Briefcase,
  Location,
  UserEdit,
} from 'iconsax-react'

const EditAddress = () => {
  return (
    <>
      <Header />
      <div className='flex text-primary mb-8 gap-3 cursor-pointer'  onClick={() =>
                  (location.href = `/${
                    location.pathname.split('/')[1]
                  }/profile/user-account`)
                }>
        <ArrowRight2 />
        <b> تغییر آدرس</b>
      </div>
      <div className='flex flex-col gap-7'>
        <>
          <div className='flex px-2  mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'>
            <Location />
            <div
              className='flex align-center justify-between'
              style={{ width: '95%' }}
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-account/edit-address/residence`)
              }>
              <p className='mr-2'> تغییر آدرس محل سکونت </p>
            </div>
            <ArrowLeft2 />
          </div>

          <div className='flex px-2  mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'>
            <Location />
            <div
              className='flex align-center justify-between'
              style={{ width: '95%' }}
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-account/edit-address/job-address`)
              }>
              <p className='mr-2'> تغییر آدرس محل کار </p>
            </div>
            <ArrowLeft2 />
          </div>
        </>
      </div>
    </>
  )
}

export default EditAddress
