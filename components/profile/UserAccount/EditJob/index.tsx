'use client'
import Calendar from '@/components/shared/Calendar'
import Header from '@/components/shared/Header'
import { ArrowRight2 } from 'iconsax-react'
import { useRef } from 'react'

const EditJobInfo = () => {
  const filterRefs = useRef({
    name: '',
    last_name: '',
    mobile: '',
    sheba: '',
    fromPrice: '',
    toPrice: '',
    fromTime: '',
    gender: '',
  })

  const handleFormSubmit = () => {}
  return (
    <>
      <Header />
      <div className='flex text-primary mb-8 gap-3 cursor-pointer'  onClick={() =>
                  (location.href = `/${
                    location.pathname.split('/')[1]
                  }/profile/user-account`)
                }>
        <ArrowRight2 />
        <b> تغییر شغل</b>
      </div>

      <form className='flex flex-col min-h-[80vh] justify-between space-y-4' onSubmit={handleFormSubmit}>
   <div className="flex flex-col gap-5">

        <div className='flex-col flex gap-1'>
          <label id='gender-label'>تخصص</label>
          <select
            defaultValue={filterRefs.current.gender}
            className='!w-full outline-none border rounded-lg h-10 cursor-pointer'
            onChange={(e) => (filterRefs.current.gender = e.target.value)}>
            <option value=''>مرد </option>
            <option value='0'>زن</option>
            <option value='1'> سایر</option>
          </select>
        </div>

        <div className='flex-col flex gap-1'>
          <label id='gender-label'>نوع صنف</label>
          <select
            defaultValue={filterRefs.current.gender}
            className='!w-full outline-none border rounded-lg h-10 cursor-pointer'
            onChange={(e) => (filterRefs.current.gender = e.target.value)}>
            <option value=''>مرد </option>
            <option value='0'>زن</option>
            <option value='1'> سایر</option>
          </select>
        </div>
        <div className='flex-col flex gap-1'>
          <label id='mobile-label'>کد صنف </label>
          <input
            id='mobile'
            type='text'
            placeholder='۲۵۴۸۷۹'
            className='w-full !rounded-lg'
            defaultValue={filterRefs.current.mobile}
            onChange={(e) => (filterRefs.current.mobile = e.target.value)}
          />
        </div>
        <div className='flex-col flex gap-1'>
        <label id='gender-label'>خدمات</label>
        <select
          defaultValue={filterRefs.current.gender}
          className='!w-full outline-none border rounded-lg h-10 cursor-pointer'
          onChange={(e) => (filterRefs.current.gender = e.target.value)}>
          <option value=''>مرد </option>
          <option value='0'>زن</option>
          <option value='1'> سایر</option>
        </select>
        </div>
   </div>
     
        <div className='w-full flex gap-4 justify-center sticky b-1 w-[80%]'>
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

export default EditJobInfo
