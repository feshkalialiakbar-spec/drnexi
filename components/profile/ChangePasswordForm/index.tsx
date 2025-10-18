'use client'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { UserChangePassword } from '@/services/user'
import toast from 'react-hot-toast'
import { useRef, useState } from 'react'
import { ArrowRight2, Eye, EyeSlash } from 'iconsax-react'
import InsertOtpForChangePassword from '../InsertOtpForChangePass'
import { CheckMark } from '@/components/shared/IconGenerator'
import { useStates } from '@/Context'

interface IChangePassSchema {
  newpassword: string
  repeatPassword: string
}

const ChangePasswordForm = ({
  accessToken,
  mobile,
}: {
  accessToken: string
  mobile: string
}) => {
  const { permissions } = useStates()
  const [showPassword, setShowPassword] = useState<{
    newPass: boolean
    repeatPassword: boolean
  }>({ newPass: false, repeatPassword: false })
  const [otpCode, setOTPcode] = useState<string>('')
  const [validate, setValidate] = useState<{
    words: boolean
    number: boolean
    length: boolean
  }>({ words: false, number: false, length: false })
  const firstInputRef = useRef<HTMLInputElement>(null)
  const secondInputRef = useRef<HTMLInputElement>(null)
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<IChangePassSchema>()

  const onSubmit: SubmitHandler<IChangePassSchema> = async (data) => {
    try {
      if (!otpCode || otpCode.length < 6) {
        toast.error('کد صحیح نمی باشد')
        return
      }
      const finalData = {
        newpassword: data.newpassword,
        otp_code: otpCode,
      }
      const response = await UserChangePassword({
        accessToken,
        data: finalData,
      })

      if (!response) {
        toast.error('خطای پیش آمد! دوباره تلاش کنید.')
        return
      }

      if (response.status === '-1') {
        toast.error(response.message)
        return
      }

      if (response.status === '1') {
        toast.success(response.message)
        location.href = `/profile`
        return true
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }

  const validator = () => {
    if (firstInputRef.current?.value.match(/(?=.*[a-z])(?=.*[A-Z])/)) {
      setValidate((prv) => ({
        words: true,
        number: prv.number,
        length: prv.length,
      }))
    } else {
      setValidate((prv) => ({
        words: false,
        number: prv.number,
        length: prv.length,
      }))
    }
    if (firstInputRef.current?.value.match(/(?=.*\d)(?=.*[!@#)`_(/$%^&*])/)) {
      setValidate((prv) => ({
        words: prv.words,
        number: true,
        length: prv.length,
      }))
    } else {
      setValidate((prv) => ({
        words: prv.words,
        number: false,
        length: prv.length,
      }))
    }
    if (`${firstInputRef.current?.value}`.length > 7) {
      setValidate((prv) => ({
        words: prv.words,
        number: prv.number,
        length: true,
      }))
    } else {
      setValidate((prv) => ({
        words: prv.words,
        number: prv.number,
        length: false,
      }))
    }
  }
  return (
    <>
      <button
        className='!font-medium !text-primary !inline-flex !items-center !gap-2 !mb-8 lg:!mb-10 !rounded-lg'
        onClick={() => (location.href = `/profile`)}>
        <ArrowRight2 size='24' color='#2f27ce' />
        پروفایل
      </button>
      {permissions[1]?.includes('777') && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col justify-between min-h-[60vh]'>
          <div className='grow mb-8'>
            <div className='mb-6 sm:mb-8'>
              <div className='relative w-full flex items-center'>
                <div className='absolute left-2 cursor-pointer'>
                  {showPassword.newPass ? (
                    <EyeSlash
                      size='24'
                      color='#111111'
                      onClick={() =>
                        setShowPassword({
                          newPass: !showPassword.newPass,
                          repeatPassword: showPassword.repeatPassword,
                        })
                      }
                    />
                  ) : (
                    <Eye
                      size='24'
                      color='#111111'
                      onClick={() =>
                        setShowPassword({
                          newPass: !showPassword.newPass,
                          repeatPassword: showPassword.repeatPassword,
                        })
                      }
                    />
                  )}
                </div>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'لطفا رمز عبور جدید را وارد کنید.',
                    },
                    validate: {
                      containsUpperAndLowerCase: (value) =>
                        (/[A-Z]/.test(value) && /[a-z]/.test(value)) ||
                        'رمز عبور باید شامل حروف بزرگ و کوچک انگلیسی باشد.',
                      minLength: (value) =>
                        value.length >= 6 ||
                        'رمز عبور باید حداقل ۶ کاراکتر باشد.',
                      containsNumber: (value) =>
                        /\d/.test(value) || 'رمز عبور باید شامل عدد باشد.',
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <input
                      id='newpassword'
                      placeholder='رمز عبور'
                      type={showPassword.newPass ? 'text' : 'password'}
                      className={`${
                        errors?.newpassword?.message && 'border-[#F97570]'
                      } w-full !rounded-lg `}
                      autoComplete='off'
                      ref={firstInputRef}
                      onChange={(e) => {
                        onChange(e.target.value)
                        validator()
                      }}
                      aria-autocomplete='none'
                    />
                  )}
                  name='newpassword'
                />
              </div>
              {errors?.newpassword && (
                <p className='mt-2 text-[#D42620]'>
                  {errors?.newpassword?.message}
                </p>
              )}
            </div>
            <div className='flex flex-col my-6'>
              <div className='flex items-center gap-3 my-2'>
                <CheckMark
                  color={`${validate.words ? '#2F27CE' : '#747B8E'}`}
                />
                <p>شامل حروف کوچک و بزرگ انگلیسی</p>
              </div>
              <div className='flex items-center gap-3 my-2'>
                <CheckMark
                  color={`${validate.length ? '#2F27CE' : '#747B8E'}`}
                />
                <p>شامل حداقل ۸ کاراکتر</p>
              </div>
              <div className='flex items-center gap-3 my-2'>
                <CheckMark
                  color={`${validate.number ? '#2F27CE' : '#747B8E'}`}
                />
                <p>شامل عدد و کاراکتر خاص</p>
              </div>
            </div>
            <div className='relative w-full flex items-center'>
              <div className='absolute left-2 cursor-pointer'>
                {showPassword?.repeatPassword ? (
                  <EyeSlash
                    size='24'
                    color='#111111'
                    onClick={() =>
                      setShowPassword({
                        newPass: showPassword.newPass,
                        repeatPassword: !showPassword.repeatPassword,
                      })
                    }
                  />
                ) : (
                  <Eye
                    size='24'
                    color='#111111'
                    onClick={() =>
                      setShowPassword({
                        newPass: showPassword.newPass,
                        repeatPassword: !showPassword.repeatPassword,
                      })
                    }
                  />
                )}
              </div>

              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'لطفا تکرار رمز عبور جدید را وارد کنید.',
                  },
                  validate: (value) =>
                    value === watch('newpassword') ||
                    'رمز عبور جدید و تکرار آن مطابقت ندارند.',
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <input
                    id='repeatPassword'
                    placeholder='تکرار رمز عبور جدید'
                    type={showPassword.repeatPassword ? 'text' : 'password'}
                    className={`${
                      errors?.repeatPassword?.message && 'border-[#F97570]'
                    } w-full h-10 pl-10 pr-2`}
                    autoComplete='off'
                    onChange={onChange}
                    value={value}
                    ref={secondInputRef}
                  />
                )}
                name='repeatPassword'
              />
            </div>
            {errors?.repeatPassword && (
              <p className='mt-2 text-[#D42620]'>
                {errors?.repeatPassword?.message}
              </p>
            )}
            <div className='my-10'>
              <InsertOtpForChangePassword phone={mobile} setCode={setOTPcode} />
            </div>
          </div>

          <button
            className='!sticky !b-1 !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 !bg-primary !rounded-lg fill-button h-10'
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
              'تایید و ذخیره'
            )}
          </button>
        </form>
      )}
    </>
  )
}

export default ChangePasswordForm
