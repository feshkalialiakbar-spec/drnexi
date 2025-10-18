'use client'

import { generateShabaSignature } from '@/hooks/useWithdrawHooks'
import { IAddShabaSchema } from '@/interfaces'
import { revalidateDataByTag } from '@/services/shared'
import { CreateShabaDestination } from '@/services/withdraw'
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const AddShebaForm = ({
  userMobile,
  accessToken,
}: {
  userMobile: string
  accessToken: string
}) => {
  const router = useRouter()

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<IAddShabaSchema>()

  const onSubmit: SubmitHandler<IAddShabaSchema> = async (data) => {
    try {
      data.acctype = 1
      data.mobile = userMobile
      data.shaba = `IR${data.shaba}`

      const sign = generateShabaSignature({
        acctype: data.acctype,
        mobile: data.mobile,
        shaba: data.shaba,
      })

      data.Signature = sign

      const response = await CreateShabaDestination({
        accessToken,
        data,
      })

      if (!response) {
        toast.error('عملیات با خطا مواجه شد، دوباره تلاش کنید.')
        return
      }

      if (response.status === '-1') {
        toast.error(response.message)
        return
      }

      if (response.message === 'شبای مقصد تکراری است') {
        toast.error(
          `شماره شبا متعلق به ${response.fullname} بوده و تکراری می‌باشد.`
        )
        return
      }

      revalidateDataByTag({ tag: 'shaba_destination_list' })
      router.push('/wallet/sheba')
      toast.success('شماره شبا با موفقیت اضافه شد.')
      return true
    } catch (err: unknown) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
      <div className='grow mb-8'>
        <div className='mb-6 sm:mb-8'>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'لطفا شماره شبا را وارد کنید.',
              },
              minLength: {
                value: 24,
                message: 'شماره شبا نباید کمتر از ۲۴ کاراکتر باشد.',
              },
              maxLength: {
                value: 24,
                message: 'شماره شبا نباید بیشتر از ۲۴ کاراکتر باشد.',
              },
              // pattern: {
              //     value: /^IR\d{24}$/,
              //     message: "شماره شبا باید با IR شروع شده و شامل ۲۴ رقم بعدی باشد."
              // },
            }}
            render={({ field: { onChange, value, ref } }) => (
              <div dir='ltr'>
                <input
                  id='shaba'
                  type='number'
                  className='w-full !rounded-lg'
                  autoComplete='off'
                  placeholder='شماره شبا'
                  value={value}
                  onChange={onChange}
                />
                IR
              </div>
            )}
            name='shaba'
          />
          {errors?.shaba && (
            <p className='mt-2 text-red-400'>{errors?.shaba?.message}</p>
          )}
        </div>

        <div className='mb-6 sm:mb-8'>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'فیلد نام مالک حساب اجباری است.',
              },
            }}
            render={({ field: { onChange, value, ref } }) => (
              <input
                id='fullname'
                type='text'
                placeholder='نام مالک حساب'
                className='w-full !rounded-lg'
                autoComplete='off'
                onChange={onChange}
              />
            )}
            name='fullname'
          />
          {errors?.fullname && (
            <p className='mt-2 text-red-400'>{errors?.fullname?.message}</p>
          )}
        </div>

        <div className='mb-6 sm:mb-8'>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'فیلد عنوان اجباری است.',
              },
            }}
            render={({ field: { onChange, value, ref } }) => (
              <input
                id='title'
                type='text'
                placeholder='عنوان'
                className='w-full !rounded-lg'
                autoComplete='off'
                onChange={onChange}
              />
            )}
            name='title'
          />
          {errors?.title && (
            <p className='mt-2 text-red-400'>{errors?.title?.message}</p>
          )}
        </div>
      </div>

      <button
        className='w-full h-10 rounded fill-button'
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
          'افزودن شبا'
        )}
      </button>
    </form>
  )
}

export default AddShebaForm
