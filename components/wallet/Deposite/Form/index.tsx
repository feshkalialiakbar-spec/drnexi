'use client'

import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useToggleDepositForm } from '@/hooks/useWalletHooks'
import { v4 as uuidv4 } from 'uuid'
import { CreateNewIPG } from '@/services/deposit'
import toast from 'react-hot-toast'
import { getAllCookies, setCookieByTagAndValue } from '@/actions/cookieToken'
import {
  useDepositInformation,
  usePaymentLinkData,
} from '@/hooks/useDepositHooks'
import { ArrowRight2 } from 'iconsax-react'
import { IDepositForm } from '@/interfaces'
import { useEffect, useState } from 'react'
import { callLogAPI } from '@/app/api/logproxy/callLog'

const DepositForm = ({ accessToken }: { accessToken: string }) => {
  const { setDepositInformation } = useDepositInformation()
  const { setPaymentLinkData } = usePaymentLinkData()
  const { setShowDepositForm } = useToggleDepositForm()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IDepositForm>()
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [tomanText, setTomanText] = useState<string>('')

  const onSubmit: SubmitHandler<IDepositForm> = async (data) => {
    try {
      data.order_id = uuidv4()
      data.amount = Number(data.amount)

      const response = await CreateNewIPG({ data, accessToken })

      await callLogAPI({
        message: `new request in wallet for deposit _FIRST-FORM_\n data
data: ${JSON.stringify(data)}
user: ${JSON.stringify(await getAllCookies())}`,
        type: 'info',
        filekoin: 'frontolag',
      })

      if (response?.status === '-1' && typeof response.message === 'string') {
        toast.error(`${response?.message}`)
        return
      }
      if (!response) {
        toast.error('مشکلی پیش آمد! لطفا دوباره تلاش کنید.')
        return
      }
      if (response.status === '1' && response.payment_url) {
        // ست کردن اطلاعات توی کوکی که در آینده با این اطلاعات رسید نشون بدیم
        setCookieByTagAndValue({
          key: 'deposit-amount',
          value: String(response.payment_amount),
        })
        setCookieByTagAndValue({
          key: 'deposit-token',
          value: response.token,
        })

        setDepositInformation(data)
        setPaymentLinkData(response)
        setShowDepositForm(false)
        return true
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }

  useEffect(() => {
    setIsMobile(window.innerWidth < 555)

    const handleViewportResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        if (viewportHeight < window.innerHeight) {
          setInputFocus(true)
        } else {
          setInputFocus(false)
        }
      }
    }

    window.visualViewport &&
      window.visualViewport.addEventListener('resize', handleViewportResize)
    return () => {
      window.visualViewport &&
        window.visualViewport.removeEventListener(
          'resize',
          handleViewportResize
        )
    }
  }, [])

  return (
    <>
      <button
        className="!font-medium !text-primary !inline-flex !items-center !gap-2 !mb-8 lg:!mb-10 !rounded-lg"
        onClick={() => (location.href = `/wallet`)}
      >
        <ArrowRight2 size="24" color="#2f27ce" />
        واریز
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between  min-h-[60vh]"
      >
        <div className="grow mb-8">
          <div className="mb-6 sm:mb-8">
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'لطفا مبلغ را وارد کنید.',
                },
                validate: {
                  notStartWithZero: (value) =>
                    value.toString()[0] !== '0' || 'مبلغ نباید با ۰ شروع شود.',
                  minimumAmount: (value) =>
                    value > 5000000 ||
                    'مبلغ باید بیشتر از ۵,۰۰۰,۰۰۰ ریال باشد.',
                  maximumAmount: (value) =>
                    value <= 2000000000 ||
                    'مبلغ نباید بیشتر از ۲,۰۰۰,۰۰۰,۰۰۰ ریال باشد.',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'لطفا عدد وارد کنید.',
                },
              }}
              render={({ field: { onChange, value, ref } }) => {
                const cleanedValue = value
                  ? String(value).replace(/,/g, '')
                  : ''
                const formattedValue = cleanedValue.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ','
                )

                const handleOnChange = async (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const inputValue = e.target.value.replace(/,/g, '')
                  // Only allow numbers
                  if (/^\d*$/.test(inputValue)) {
                    onChange(inputValue)
                  }
                  if (inputValue.length < 22) {
                    await fetch(`/api/number2word?value=${inputValue}`)
                      .then((response) => response.json())
                      .then((data) => setTomanText(data.tomanText))
                      .catch((error) =>
                        console.error('Error fetching data:', error)
                      )
                  }
                }
                return (
                  <>
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
                    />
                    <input
                      id="amount"
                      type="text"
                      placeholder="مبلغ (ریال)"
                      inputMode="numeric"
                      className={`${
                        errors?.amount?.message && 'border-[#F97570]'
                      } w-full !rounded-lg`}
                      autoComplete="off"
                      value={formattedValue}
                      onChange={handleOnChange}
                    />
                    {tomanText && (
                      <p className="text-slate-500 text-xs">
                        {tomanText} تومان
                      </p>
                    )}
                  </>
                )
              }}
              name="amount"
            />
            {errors?.amount && (
              <p className="mt-2 text-[#D42620]">{errors?.amount?.message}</p>
            )}
          </div>

          <div className="mb-6 sm:mb-8">
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'این فیلد اجباری است.',
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
                  id="mobile"
                  type="tell"
                  inputMode="numeric"
                  placeholder="شماره موبایل"
                  className={`${
                    errors?.mobile?.message && 'border-[#F97570]'
                  } w-full !rounded-lg`}
                  autoComplete="off"
                  onChange={onChange}
                />
              )}
              name="mobile"
            />
            {errors?.mobile && (
              <p className="mt-2 text-[#D42620]">{errors?.mobile?.message}</p>
            )}
          </div>

          <div className="mb-6 sm:mb-8">
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'این فیلد اجباری است.',
                },
              }}
              render={({ field: { onChange, value, ref } }) => (
                <input
                  id="cust_name"
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  className={`${
                    errors?.cust_name?.message && 'border-[#F97570]'
                  } w-full !rounded-lg`}
                  autoComplete="off"
                  onChange={onChange}
                />
              )}
              name="cust_name"
            />
            {errors?.cust_name && (
              <p className="mt-2 text-[#D42620]">
                {errors?.cust_name?.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              control={control}
              rules={{}}
              render={({ field: { onChange, value, ref } }) => (
                <input
                  id="description"
                  type="text"
                  placeholder="شرح پرداخت"
                  className="w-full !rounded-lg"
                  autoComplete="off"
                  onChange={onChange}
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                />
              )}
              name="description"
            />
          </div>
        </div>
        <button
          className={`${
            isMobile && inputFocus ? 'translate-y-[40vh]' : 'translate-y-[65vh]'
          } fixed w-[92%] max-w-[840px] flex justify-center !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 fill-button !rounded-lg`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            'ادامه'
          )}
        </button>
      </form>
    </>
  )
}
export default DepositForm
