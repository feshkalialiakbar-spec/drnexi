'use client'
import Calendar from '@/components/shared/Calendar'
import Header from '@/components/shared/Header'
import { ArrowRight2 } from 'iconsax-react'
import { useRef } from 'react'

const EditPersonalInfo = () => {
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

  
  const handleFormSubmit = () => {

  }
  return (
    <>
      <Header />
      <div className='flex text-primary mb-8 gap-3 cursor-pointer'  onClick={() =>
                  (location.href = `/${
                    location.pathname.split('/')[1]
                  }/profile/user-account`)
                }>
        <ArrowRight2 />
        <b> تغییر اطلاعات شخصی</b>
      </div>

      <form className='space-y-4' onSubmit={handleFormSubmit}>
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
        <div className='flex-col flex gap-1'>
          <label id='mobile-label'>کد ملی </label>
          <input
            id='mobile'
            type='text'
            placeholder='0024242424'
            className='w-full !rounded-lg'
            defaultValue={filterRefs.current.mobile}
            onChange={(e) => (filterRefs.current.mobile = e.target.value)}
          />
        </div>
        <div className='flex-col flex gap-1'>
          <label id='demo-simple-select-label !m-7'> تلفن ثابت</label>
          <input
            id='pan'
            type='number'
            placeholder='02122222222'
            className='w-full !rounded-lg'
            autoComplete='off'
            onChange={(e) => (filterRefs.current.sheba = e.target.value)}
            aria-autocomplete='none'
          />
        </div>
      
        <div className='flex-col flex gap-1'>
          <label id='demo-simple-select-label !m-7'>تاریخ تولد </label>

          <Calendar setDate={(date) => (filterRefs.current.fromTime = date)} />
        </div>
        <label id='gender-label'>جنسیت</label>
        <select
          defaultValue={filterRefs.current.gender}
          className='!w-full outline-none border rounded h-10 cursor-pointer'
          onChange={(e) => (filterRefs.current.gender = e.target.value)}>
          <option value=''>مرد </option>
          <option value='0'>زن</option>
          <option value='1'> سایر</option>
        </select>
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

export default EditPersonalInfo
