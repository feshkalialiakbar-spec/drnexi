'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowRight2 } from 'iconsax-react'
import { IsAssistantExist, SelectAssistant } from '@/services/clerk'
import Loading from '@/components/shared/LoadingSpinner'
import { SendSignUpSMS } from '@/services/sendSMS'
import { GetCurrentUser } from '@/services/user'
import { useStates } from '@/Context'
interface IAddClerkForm {
  mobile: string
  nick_name: string
}

const AddClerkForm = ({ accessToken }: { accessToken: string }) => {
  const { permissions } = useStates()
  const [assist, setAssist] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [toastConfirm, setToastConfirm] = useState<{
    showModal: boolean
    confirmed: boolean
  }>({ showModal: false, confirmed: false })

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IAddClerkForm>()
  const saveAssist = async (mobile: string, nick_name: string) => {
    try {
      const response = await SelectAssistant({
        phone: mobile,
        nickName: nick_name,
        accessToken,
      })
      if (!response) {
        toast.error('خطایی پیش آمد! لطفا دوباره تلاش کنید.')
        return
      }
      if (response.status === '-1') {
        toast.error(response.message)
        return
      }
      if (response.status === '1') {
        location.href = `/clerk`
        toast.success('دستیار با موفقیت اضافه شد!')
        return true
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }
  const onSubmit: SubmitHandler<IAddClerkForm> = async (data) => {
    if (!toastConfirm.confirmed) {
      setToastConfirm({ showModal: true, confirmed: false })
      return
    } else {
      await saveAssist(data.mobile, data.nick_name)
    }
  }
  const sendSms = async () => {
    const user = await GetCurrentUser({ accessToken })
    user && SendSignUpSMS(getValues('mobile'), user.full_name, user.mobile)
    toast.success('لینک ثبت نام با موفقیت ارسال شد')
  }
  return (
    <>
      <button
        className='!font-medium !text-primary !inline-flex !items-center !gap-2 !mb-8 !lg:mb-10 !rounded-lg'
        onClick={() => (location.href = `/clerk`)}>
        <ArrowRight2 size='24' color='#2f27ce' />
        افزودن دستیار
      </button>

      {permissions[1]?.includes('772') && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col min-h-[75vh] justify-between'>
          <div className='grow mb-8'>
            <div className='mb-6 sm:mb-8'>
              <Controller
                control={control}
                name='mobile'
                rules={{
                  required: {
                    value: true,
                    message: 'لطفا شماره موبایل خود را وارد کنید.',
                  },
                  minLength: {
                    value: 11,
                    message: 'شماره موبایل نباید کمتر از ۱۱ رقم باشد.',
                  },
                  maxLength: {
                    value: 11,
                    message: 'شماره موبایل نباید بیشتر از ۱۱ رقم باشد.',
                  },
                  pattern: {
                    value: /^09\d{9}$/,
                    message: 'شماره موبایل باید با ۰۹ شروع شود.',
                  },
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <>
                    <label htmlFor='mobile'>شماره موبایل </label>
                    <input
                      id='mobile-no'
                      type='tel'
                      maxLength={11}
                      placeholder='****۰۹۱۲'
                      style={{ direction: 'rtl' }}
                      className={`${
                        errors?.mobile?.message && 'border-[#F97570]'
                      } w-full !rounded-lg`}
                      autoComplete='off'
                      onKeyDown={(e) => e.key === 'Backspace' && setAssist('')}
                      onChange={async (e) => {
                        onChange(e.target.value)
                        if (e.target.value.length === 11) {
                          setLoading(true)
                          const result = await IsAssistantExist({
                            phone: e.target.value,
                            accessToken,
                          })
                          if (result?.full_name) {
                            setAssist(result?.full_name)
                          } else {
                            setAssist(null)
                          }
                          setLoading(false)
                        }
                      }}
                      ref={ref}
                      value={value || ''}
                    />
                  </>
                )}
              />
              {errors?.mobile && (
                <p className='mt-2 text-[#D42620]'>{errors?.mobile?.message}</p>
              )}
              {loading && (
                <div className='m-1'>
                  <Loading />
                </div>
              )}
              {
                <p
                  className={`${
                    typeof assist === 'string'
                      ? 'text-[#0F973D]'
                      : 'text-[#D42620]'
                  }`}>
                  {typeof assist === 'string'
                    ? assist
                    : 'این شماره موبایل در سامانه ثبت نام نکرده‌ است.'}
                </p>
              }
            </div>
            <div className='mb-6 sm:mb-8'>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'این فیلد اجباری است.',
                  },
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <>
                    <label htmlFor='nick_name'>نام مستعار</label>
                    <input
                      id='nick_name'
                      type='text'
                      readOnly={!assist?.length}
                      placeholder='دستیار عزیزی'
                      className={`${!assist?.length && 'bg-[#EDF0F2]'} ${
                        errors?.nick_name?.message && 'border-[#F97570]'
                      } w-full !rounded-lg`}
                      autoComplete='off'
                      onChange={onChange}
                    />
                  </>
                )}
                name='nick_name'
              />
              {errors?.nick_name && (
                <p className='mt-2 text-[#D42620]'>
                  {errors?.nick_name?.message}
                </p>
              )}
            </div>
          </div>
          {assist !== null ? (
            <button
              className='w-full flex items-center justify-center !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 !bg-primary !rounded-lg fill-button'
              type='submit'
              disabled={isSubmitting}>
              {isSubmitting ? (
                <svg
                  aria-hidden='true'
                  className='w-6 h-6 text-gray-200 animate-spin fill-white'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
              ) : (
                'افزودن دستیار'
              )}
            </button>
          ) : (
            <div className='flex gap-5'>
              <button
                className='w-full flex items-center justify-center !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 !bg-primary !rounded-lg fill-button'
                onClick={() => (location.href = '/auth/sign-up')}
                disabled={isSubmitting}>
                ثبت نام
              </button>
              <button
                className='border-button rounded-lg w-full'
                onClick={sendSms}>
                ارسال لینک ثبت نام
              </button>
            </div>
          )}
        </form>
      )}
      {toastConfirm.showModal && (
        <>
          <div
            className={` bg-slate-900 z-20 opacity-50 w-[100vw] h-[100vh] left-0 top-[0px] absolute`}></div>
          <div
            className={`${
              toastConfirm ? 'animate-logout' : ''
            } bg-white p-6 absolute w-[93%] bottom-24 max-w-[880px] rounded z-30`}>
            <p className='text-center font-medium'>
              پس از تایید <b className='text-primary'>{assist}</b> به عنوان
              دستیار، ایشان به کیف پول شما جهت دریافت وجوه دسترسی خواهند داشت.
              آیا ایشان را به عنوان دستیار تایید می‌کنید؟
            </p>
            <div className='flex gap-6 mt-6 sm:mt-8'>
              <div className='flex-1'>
                <button
                  className='fill-button w-full  h-10 rounded-lg'
                  onClick={async () => {
                    setToastConfirm({ showModal: false, confirmed: true })
                    await saveAssist(
                      getValues('mobile'),
                      getValues('nick_name')
                    )
                  }}>
                  تایید می‌کنم
                </button>
              </div>
              <div className='flex-1'>
                <button
                  className='border-button h-10 w-full !rounded-lg'
                  onClick={() =>
                    setToastConfirm({ showModal: false, confirmed: false })
                  }>
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AddClerkForm
