'use client'
import Header from '@/components/shared/Header'
import {
  ArrowLeft2,
  ArrowRight2,
  Briefcase,
  Location,
  UserEdit,
} from 'iconsax-react'

const UserAccount = ({ role }: { role: string }) => {
  return (
    <>
      <Header />
      <div className='flex text-primary mb-8 gap-3 cursor-pointer' onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile`)
              } >
        <ArrowRight2 />
        <b>حساب کاربری</b>
      </div>
      <div className='flex flex-col gap-7'>
        {[`${process.env.NEXT_PUBLIC_DOCTOR_ROLE}`].includes(role) && (
          <>
            <div
              className='flex px-2  mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-account/edit-user-info`)
              }>
              <UserEdit />
              <div
                className='flex align-center justify-between'
                style={{ width: '95%' }}>
                <p className='mr-2'> تغییر اطلاعات شخصی </p>
              </div>
              <ArrowLeft2 />
            </div>

            <div
              className='flex px-2  mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-account/edit-job`)
              }>
              <Briefcase />
              <div
                className='flex align-center justify-between'
                style={{ width: '95%' }}>
                <p className='mr-2'> تغییر شغل </p>
              </div>
              <ArrowLeft2 />
            </div>

            <div
              className='flex px-2  mt-5 mb-5 justify-between cursor-pointer text-[#2f27ce]'
              onClick={() =>
                (location.href = `/${
                  location.pathname.split('/')[1]
                }/profile/user-account/edit-address`)
              }>
              <Location />
              <div
                className='flex align-center justify-between'
                style={{ width: '95%' }}>
                <p className='mr-2'> تغییر آدرس </p>
              </div>
              <ArrowLeft2 />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default UserAccount
