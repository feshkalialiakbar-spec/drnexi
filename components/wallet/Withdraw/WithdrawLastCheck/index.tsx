'use client'

import OTPInput from '@/components/shared/OTPinput'
import eventEmitter from '@/Event'
import { useKeepReceiptData } from '@/hooks/useReceipt'
import { useAddCommasToNumber } from '@/hooks/useSharedHooks'
import { useKeepWithdrawFormData } from '@/hooks/useWalletHooks'
import {
  generateWidhrawSignature,
  useWithdrawStepTwo,
} from '@/hooks/useWithdrawHooks'
import { revalidateDataByTag } from '@/services/shared'
import {
  GetWithdrawalOrderOtp,
  WithdrawalOrderRequest,
} from '@/services/withdraw'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface IFormSchema {
  otp_code: string
}

const WithdrawLastCheck = ({
  userMobile,
  accessToken,
}: {
  userMobile: string
  accessToken: string
}) => {
  const router = useRouter()
  const { withdrawForm, setWithdrawForm } = useKeepWithdrawFormData()
  const { setReceiptData } = useKeepReceiptData()
  const { setShowWithdrawStepTwo } = useWithdrawStepTwo()
  const [disableOtpInput, setDisableOtpInput] = useState<boolean>(false)
  const [showSendOtpButton, setShowSendOtpButton] = useState(true)
  const [timeLeft, setTimeLeft] = useState(87) // 120 seconds (2 minutes)
  const [otp, setOtp] = useState('')

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<IFormSchema>()

  const onSubmit: SubmitHandler<IFormSchema> = async (data) => {
    //  toast.error(
    //                 // 'سیستم در حال به‌روزرسانی است. لطفاً بعدا تلاش کنید. \nاز صبر و شکیبایی شما سپاسگزاریم.'
    //                 'ضمن عرض پوزش سیستم بانکی با اختلال موقت همراه است.'
    //               )
    try {
      if (!otp || otp === undefined) {
        toast.error('لطفا ارسال کد را بزنید تا کد برای شما ارسال شود')
        return
      }

      const sign = generateWidhrawSignature({
        withdrawalType: 3,
        customerMobile: userMobile,
        // amount: String(watch("amount")),
        amount: String(withdrawForm.amount),
        shabaId: withdrawForm.shebaId as string,
      })

      const finalData = {
        target_id: withdrawForm.shebaId || '',
        amount: withdrawForm.amount || 0,
        otp_code: otp,
        description: withdrawForm.description || '',
        Signature: sign,
      }

      const response = await WithdrawalOrderRequest({
        data: finalData,
        accessToken,
      })

      if (!response) {
        toast.error('خطایی رخ داد! لطفا دوباره تلاش کنید.')
        return
      }

      if (response.status === '-1') {
        toast.error(response.message)
        return
      }

      if (response.status === '1') {
        revalidateDataByTag({ tag: 'sbw_TotalaccountDetail' })
        toast.success(response.message)
        setReceiptData({
          amount: `${String(response.amount)}` || '',
          user_uid: response.withdrawal_name || '',
          transactionDate_pe: response.date || '',
          pan: response.withdrawal_address || '',
          tstatus: '1',
          withdrawal_address: response.withdrawal_address || '',
          tracking_number: response.tracking_number || '',
          remain: '',
          originalAmount: response?.originalAmount || '',
          transactionTime: '',
          wage_cost: '',
          ttype: '',
        })
        eventEmitter.emit('updateTransactions')
        router.push(`/receipt`)
        setWithdrawForm({
          shebaId: '',
          shebaNumber: '',
          amount: 0,
          description: '',
          shebaUsername: '',
        })
        setShowWithdrawStepTwo(false)
        return true
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }

  const sendOtpHandler = async () => {
    setDisableOtpInput(true)
    const response = await GetWithdrawalOrderOtp({ accessToken })

    if (!response) {
      toast.error('متاسفانه در ارسال کد مشکلی پیش آمد! دوباره تلاش کنید.')
      setDisableOtpInput(false)
      return
    }
    if (response.status === '-1') {
      toast.error(response.message)
      return
    }

    if (response.status === '1') {
      setShowSendOtpButton(false)
      setTimeLeft(97)
      setDisableOtpInput(true)
      toast.success('کد با موفقیت پیامک شد!')
      setTimeout(() => {
        setDisableOtpInput(false)
      }, 6000)
      return
    }
  }
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setShowSendOtpButton(true)
    }
  }, [timeLeft])

  return (
    <>
      <ul className="mb-8 sm:mb-10">
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">مبلغ</span>
          <span className="text-slate-900">
            {useAddCommasToNumber(withdrawForm.amount as number) || 0}{' '}
            <small>ریال</small>
          </span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">شبا مقصد</span>
          <span className="text-slate-900">{`IR${withdrawForm.shebaNumber}`}</span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">نام بانک مقصد</span>
          <span className="text-slate-900">{withdrawForm.bankName}</span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">نام صاحب حساب</span>
          <span className="text-slate-900">{withdrawForm.shebaUsername}</span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">شرح</span>
          <span className="text-slate-900">{withdrawForm.description}</span>
        </li>
      </ul>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-14 sm:mb-16">
          <Controller
            control={control}
            name="otp_code"
            rules={{}}
            render={({ field: { onChange, value, ref } }) => (
              <>
                <label htmlFor="otp_code" className="mb-2 inline-block">
                  کد تایید
                </label>
                <div className="flex items-end sm:items-center sm:justify-between flex-col sm:flex-row">
                  <div>
                    <OTPInput setResult={setOtp} />
                  </div>

                  {showSendOtpButton ? (
                    <button
                      className="!mt-4 sm:!mt-0 !rounded-lg fill-button h-10 min-w-40"
                      disabled={disableOtpInput}
                      onClick={sendOtpHandler}
                    >
                      ارسال کد
                    </button>
                  ) : (
                    <p className="text-amber-700">
                      {Math.floor(timeLeft / 60)}:
                      {('0' + (timeLeft % 60)).slice(-2)}
                    </p>
                  )}
                </div>
              </>
            )}
          />
        </div>
        <p className="text-blue-50 bg-blue-700 p-3 my-5 pl-12">
          🔔 اطلاعیه
          <br />
          برداشت‌ها به صورت اتوماتیک انجام می‌شود و در سه چرخه پایا روزانه به
          حساب ذی‌نفعان واریز خواهد شد. همچنین، کد رهگیری تراکنش‌ها سه مرتبه در
          طول روز صادر می‌گردد. بدیهی است که کلیه برداشت‌ها صرفاً مربوط به اشخاص
          حقیقی می‌باشد.
        </p>
        <button
          className="w-full flex justify-center !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 !bg-red-600 !rounded-lg text-white"
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
            'برداشت'
          )}
        </button>
      </form>
    </>
  )
}

export default WithdrawLastCheck

