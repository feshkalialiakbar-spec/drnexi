'use client'

import { useToggleOtpForm } from '@/hooks/useToggle'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  GetCurrentUser,
  GetUserPermissions,
  UserLoginAPI,
} from '@/services/user'
import {
  deleteAllCookies,
  IAccessTokenResponse,
  setCurrentUsertoCookie,
  setTokenIntoCookie,
} from '@/actions/cookieToken'
import { useState } from 'react'
import { Eye, EyeSlash } from 'iconsax-react'
import Captcha from './Captcha'
import LoadingComponent from '@/components/Loading/page'

type InputsProps = {
  username: string
  password: string
}

const LoginForm = () => {
  const { setShowOtpForm } = useToggleOtpForm()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isBot, setIsBot] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<InputsProps>()

  const onSubmit: SubmitHandler<InputsProps> = async (data) => {
    if (!isBot) {
      try {
        setLoading(true)
        const response: IAccessTokenResponse | undefined = await UserLoginAPI({
          identifier: data.username,
          credential: data.password,
        })

        if (!response) {
          setLoading(false)
          toast.error('نام کاربری یا رمز عبور اشتباه است !')
          return
        }
        await deleteAllCookies()
        if (response.access_token) {
          await setTokenIntoCookie({
            data: response as IAccessTokenResponse,
            mobile: data.username,
          })
          const currentUser = await GetCurrentUser({
            accessToken: response.access_token,
          })
          if (currentUser) await setCurrentUsertoCookie({ data: currentUser })
          toast.success(
            'هویت شما تایید شد. لطفا برای ورود چند لحظه منتظر بمانید!'
          )
          if (!currentUser) return
          if (currentUser?.user_role_id) {
            await GetUserPermissions({
              accessToken: response.access_token,
              role_id: currentUser.user_role_id,
            }).then((result) => {
              if (result) {
                const value = JSON.stringify(
                  result?.reduce(
                    (acc, row) => {
                      acc[0].push(row.menu_code)
                      acc[1].push(row.form_code)
                      acc[2].push(row.action_type)
                      return acc
                    },
                    [[], [], []] as [string[], string[], number[]]
                  )
                )
                document.cookie = `uzrprm=${encodeURIComponent(
                  value
                )}; path=/; max-age=4200; SameSite=Lax`
              }
            })
          }
          if (currentUser.user_status === 'INACTIVE') {
            location.href = '/auth/validator'
            return
          }
          if (
            currentUser.approve_status !== 1
            // ||
            // currentUser.user_approve_status !== 1
          ) {
            toast.error('کاربر در انتظار تایید می باشد')
            setLoading(false)
            return
          }
          if (currentUser.user_status === 'DISABLED') {
            setLoading(false)
            toast.error('کاربر غیر فعال می باشد')
            return
          }
          if (currentUser.role_count > 1) {
            location.href = '/select-wallet'
          } else {
            location.href = '/wallet'
          }
        }
      } catch (err: unknown) {
        console.log(err)
        setLoading(false)
      }
    } else {
      toast.error('کد کپچا صحیح نمی باشد')
    }
  }

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
            <div className='grow mb-8'>
              <div className='mb-6 sm:mb-8'>
                <label htmlFor='username' className='block mb-3'>
                  شماره موبایل
                </label>
                <Controller
                  control={control}
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
                    <input
                      id='username'
                      type='tel'
                      style={{ direction: 'rtl' }}
                      inputMode='numeric'
                      className={`${errors?.username?.message && ' border-[#F97570]'
                        } w-full h-10 border rounded px-2`}
                      autoComplete='off'
                      onChange={onChange}
                      value={value}
                      ref={ref}
                    />
                  )}
                  name='username'
                />
                {errors?.username && (
                  <p className='mt-2 text-[#D42620]'>
                    {errors?.username?.message}
                  </p>
                )}
              </div>
              <div className='mb-6 sm:mb-8'>
                <label htmlFor='password' className='block mb-3'>
                  رمز عبور
                </label>
                <div className='relative w-full flex items-center'>
                  <div className='absolute left-2 cursor-pointer'>
                    {showPassword ? (
                      <EyeSlash
                        size='24'
                        color='#111111'
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Eye
                        size='24'
                        color='#111111'
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>

                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: 'لطفا رمز عبور خود را وارد کنید.',
                      },
                    }}
                    render={({ field: { onChange, value, ref } }) => (
                      <input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        className={`${errors?.password?.message && 'border-[#F97570]'
                          } w-full h-10 pl-10 pr-2`}
                        autoComplete='off'
                        onChange={onChange}
                        value={value}
                        ref={ref}
                      />
                    )}
                    name='password'
                  />
                </div>
                {errors?.password && (
                  <p className='mt-2 text-[#D42620]'>
                    {errors?.password?.message}
                  </p>
                )}
              </div>
              <Captcha onSubmit={setIsBot} />
            </div>
            <div className='flex flex-row-reverse gap-4 mt-10 sm:gap-6'>
              <div className='flex-1'>
                <button
                  className='w-full !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 !rounded-lg fill-button'
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
                    'ورود به دکترنکسی'
                  )}
                </button>
              </div>
              <div className='flex-1'>
                <button
                  className='w-full !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 !rounded-lg border-button'
                  onClick={() => setShowOtpForm(true)}
                  disabled={isSubmitting}>
                  ورود با رمز یک‌بار مصرف
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  )
}

export default LoginForm
