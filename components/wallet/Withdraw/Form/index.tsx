'use client'
import { useForm, Controller } from 'react-hook-form'
import { useKeepWithdrawFormData } from '@/hooks/useWalletHooks'
import { useEffect, useState } from 'react'
import {
  generateShabaSignature,
  useWithdrawStepTwo,
} from '@/hooks/useWithdrawHooks'
import {
  CreateShabaDestination,
  GetShabaDestinationList,
  IShabaDestinationList,
} from '@/services/withdraw'
import ShebaItem from '../ShebaItem'
import { AddCircle, CloseCircle } from 'iconsax-react'
import { GetCurrentUser } from '@/services/user'
import { getAccessToken } from '@/hooks/getAccessToken'
import toast from 'react-hot-toast'
import { IWithdrawFormSchema } from '@/interfaces'
import Loading from '@/components/shared/LoadingSpinner'
import Image from 'next/image'
import { bankImages } from '@/components/shared/MatchingBankLogo'
import { GetAccountBalance } from '@/services/reports'
import { useStates } from '@/Context'
import { IsHolidayToday } from '@/services/generals'
import { getCookieByKey } from '@/actions/cookieToken'

const WithdrawForm = () => {
  const { permissions } = useStates()
  const { withdrawForm, setWithdrawForm } = useKeepWithdrawFormData()
  const { setShowWithdrawStepTwo } = useWithdrawStepTwo()
  const [shebaItems, setShebaItems] = useState<
    IShabaDestinationList[] | undefined | []
  >([])
  const [filteredShebaItems, setFilteredShebaItems] = useState<
    IShabaDestinationList[] | undefined | []
  >([])

  const [selectedSheba, setSelectedSheba] = useState<{
    name: string
    bank: string
  }>()
  const [loading, setLoading] = useState<boolean>(false)
  const [showShabaSuggestion, setShowShabaSuggestion] = useState<boolean>(false)
  const [tomanText, setTomanText] = useState<string>('')
  const [isHoliday, setIsHoliday] = useState<boolean>()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    setValue,
  } = useForm<IWithdrawFormSchema>()

  const withdraSubmit = async (data: any) => {
    const accessToken = await getAccessToken()
    const accountBalance = await GetAccountBalance({ accessToken })
    if (accountBalance) {
      if (Number(accountBalance[0]?.amount) < Number(data.amount)) {
        toast.error('موجودی حساب شما برای این تراکنش کافی نیست')
        return
      }
    }
    try {
      if (withdrawForm.shebaId === '') {
      } else {
       // toast.console.error( ' اطلاعیهبه دلیل بروز اختلال در اتاق پایا ، واریزی‌های چرخه سوم (آخرین سیکل پایای امروز) در سیکل پایای فردا(پنجشنبه سوم مهرماه) به حساب مقصد واریز خواهد شد.');
           setWithdrawForm({
          ...withdrawForm,
          amount: Number(data.amount),
          shebaNumber: data.shaba_number,
          description: data.description,
        })
        if (isHoliday)
          toast.error(
            // 'سیستم در حال به‌روزرسانی است. لطفاً بعدا تلاش کنید. \nاز صبر و شکیبایی شما سپاسگزاریم.'
            // 'ضمن عرض پوزش سیستم بانکی با اختلال موقت همراه است.'
            `انجام برداشت در روزهای تعطیل امکان‌پذیر نمی‌باشد.
لطفاً در روزهای کاری نسبت به ثبت درخواست برداشت اقدام فرمایید.`
          )

        else setShowWithdrawStepTwo(true)
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }
  console.log(isHoliday)
  useEffect(() => {
    setValue('shaba_number', withdrawForm.shebaNumber || '')
    if (
      withdrawForm.shebaNumber &&
      !selectedSheba?.name &&
      withdrawForm.shebaUsername &&
      withdrawForm.bankCode
    ) {
      setSelectedSheba({
        name: withdrawForm.shebaUsername,
        bank: withdrawForm.bankCode,
      })
    }
    const checkHoliday = async () => {
      const accessToken = await getCookieByKey('access_token')
      await IsHolidayToday({
        accessToken,
      }).then((response) => {
        if (response) setIsHoliday(response.HOLIDAY == 1)
      })
    }
    checkHoliday()
    const closeShebaList = (event: MouseEvent) => {
      const list = document.getElementById('sheba-list')
      const input = document.getElementById('sheba-input')
      if (
        showShabaSuggestion &&
        list &&
        !list.contains(event.target as Node) &&
        input &&
        !input.contains(event.target as Node)
      ) {
        setShowShabaSuggestion(false)
      }
    }

    window.addEventListener('click', closeShebaList)
    return () => {
      window.removeEventListener('click', closeShebaList)
    }
  }, [permissions, withdrawForm, setValue, showShabaSuggestion, selectedSheba]) // ⚠️ selectedSheba حذف شد

  const searching = (value: string) => {
    const filteredData = shebaItems?.filter(
      (item) =>
        item.shaba.toString().includes(value) ||
        item.bank_name.toString().includes(value) ||
        item.fullname.toString().includes(value) ||
        item.mobile.toString().includes(value) ||
        item.sdtitle.toString().includes(value)
    )
    setFilteredShebaItems(filteredData)
  }

  return (
    <form onSubmit={handleSubmit(withdraSubmit)} className="flex flex-col">
      <div className="grow mb-8 sm:mb-10">
        <div className="mb-6 sm:mb-8 relative">
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
            }}
            render={({ field: { onChange, value, ref } }) => (
              <div className="w-full">
                <div id="sheba-input">
                  <label htmlFor="username" className="block mb-3">
                    شماره شبا
                  </label>
                  <div className="relative w-full flex items-center">
                    <input
                      style={{ direction: 'ltr' }}
                      id="shaba_number"
                      maxLength={24}
                      className={`${
                        errors?.shaba_number?.message && 'border-[#F97570]'
                      } w-full !rounded-lg px-2`}
                      autoComplete="off"
                      placeholder="1234-1123-4135-1312-1235-1456"
                      value={value}
                      onClick={() => setShowShabaSuggestion(true)}
                      onPaste={async (e) => {
                        const shebaNumber = e.clipboardData
                          .getData('text')
                          .replace(/[^0-9]/g, '')
                        setValue('shaba_number', shebaNumber)
                        if (
                          shebaNumber.length === 24 &&
                          permissions[1]?.includes('710')
                        ) {
                          setLoading(true)
                          const accessToken = await getAccessToken()
                          const user = await GetCurrentUser({
                            accessToken,
                          })
                          const sign =
                            user &&
                            generateShabaSignature({
                              acctype: 1,
                              mobile: user?.mobile,
                              shaba: `IR${shebaNumber}`,
                            })
                          if (accessToken && sign) {
                            const response = await CreateShabaDestination({
                              accessToken,
                              data: {
                                title: '',
                                acctype: 1,
                                mobile: user?.mobile,
                                shaba: `IR${shebaNumber}`,
                                fullname: '',
                                Signature: sign,
                              },
                            })
                            response?.status === '-1' &&
                              toast.error(response?.message)
                            if (response?.status === '1') {
                              const shebaList = await GetShabaDestinationList({
                                accessToken,
                              })

                              setShebaItems(shebaList)
                              if (shebaList) {
                                const shebaIndex = shebaList.findIndex(
                                  (item) => item.fullname === response?.fullname
                                )

                                if (shebaIndex !== -1 && shebaList) {
                                  const matchedSheba = shebaList[shebaIndex]
                                  setSelectedSheba({
                                    name: matchedSheba?.fullname,
                                    bank: matchedSheba?.bank_code,
                                  })
                                  setWithdrawForm({
                                    ...withdrawForm,
                                    shebaNumber: matchedSheba.shaba?.slice(2),
                                    shebaId: `${matchedSheba.sid}`,
                                    shebaUsername: matchedSheba.fullname,
                                    bankName: matchedSheba.bank_name,
                                  })
                                }
                              }
                            }
                            setLoading(false)
                          }
                        }
                      }}
                      onFocus={async () => {
                        if (shebaItems?.length === 0) {
                          setShowShabaSuggestion(true)
                          const accessToken = await getAccessToken()
                          const shebaList = await GetShabaDestinationList({
                            accessToken,
                          })
                          setShebaItems(shebaList)
                          setFilteredShebaItems(shebaList)
                        }
                      }}
                      onChange={async (e) => {
                        // if (!/^\d*$/.test(e.target.value)) return
                        if (e.target.value.length > 1) {
                          if (!isNaN(Number(e.target.value))) {
                            if (!/^[0-9]*$/.test(`${e.target.value}`)) return
                          } else if (isNaN(Number(e.target.value))) {
                            if (
                              !/^[\u0600-\u06FF\s]*$/.test(`${e.target.value}`)
                            )
                              return
                          }
                        }
                        onChange(e.target.value)
                        e.target.value.length > 0 && searching(e.target.value)
                        if (selectedSheba?.name) {
                          if (e.target.value.length < 24) {
                            setSelectedSheba({ name: '', bank: '' })
                          }
                        }
                        setWithdrawForm({
                          ...withdrawForm,
                          shebaNumber: e.target.value || '',
                        })
                        if (e.target.value.length === 24) {
                          setLoading(true)
                          const accessToken = await getAccessToken()
                          const user = await GetCurrentUser({
                            accessToken,
                          })
                          const sign =
                            user &&
                            generateShabaSignature({
                              acctype: 1,
                              mobile: user?.mobile,
                              shaba: `IR${e.target.value}`,
                            })
                          if (accessToken && sign) {
                            const response = await CreateShabaDestination({
                              accessToken,
                              data: {
                                title: '',
                                acctype: 1,
                                mobile: user?.mobile,
                                shaba: `IR${e.target.value}`,
                                fullname: '',
                                Signature: sign,
                              },
                            })
                            response?.status === '-1' &&
                              toast.error(response?.message)
                            if (response?.status === '1') {
                              const shebaList = await GetShabaDestinationList({
                                accessToken,
                              })
                              if (shebaList) {
                                const shebaIndex = shebaList.findIndex(
                                  (item) => item.fullname === response?.fullname
                                )

                                if (shebaIndex !== -1 && shebaList) {
                                  const matchedSheba = shebaList[shebaIndex]
                                  setSelectedSheba({
                                    name: matchedSheba?.fullname,
                                    bank: matchedSheba?.bank_code,
                                  })
                                  setWithdrawForm({
                                    ...withdrawForm,
                                    shebaNumber: matchedSheba.shaba?.slice(2),
                                    shebaId: `${matchedSheba.sid}`,
                                    shebaUsername: matchedSheba.fullname,
                                    bankName: matchedSheba.bank_code,
                                  })
                                  setShebaItems(shebaList)
                                  const newSheba = shebaList.filter(
                                    (sheba) => sheba.sid === response.uid
                                  )
                                  setFilteredShebaItems(newSheba)
                                }
                              }
                            }
                            setLoading(false)
                          }
                        }
                      }}
                      aria-autocomplete="none"
                    />
                    {permissions[1]?.includes('710') && (
                      <div
                        className="absolute right-2 cursor-pointer"
                        onClick={() => (location.href = `/wallet/sheba`)}
                      >
                        <AddCircle color="#2F27CE" />
                      </div>
                    )}
                  </div>
                  {loading && (
                    <div className="flex justify-center items-center">
                      {<Loading />}
                    </div>
                  )}
                  {selectedSheba && (
                    <div className="w-full flex justify-between px-2 text-primary">
                      <p>{selectedSheba?.name}</p>
                      {bankImages[selectedSheba?.bank] && (
                        <Image
                          src={bankImages[selectedSheba?.bank] || ''}
                          width={30}
                          height={30}
                          alt={'بانک'}
                          className="inline-block rounded-full"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            name="shaba_number"
          />
          {errors?.shaba_number && (
            <p className="mt-2 text-[#D42620]">
              {errors?.shaba_number?.message}
            </p>
          )}

          {showShabaSuggestion && (
            <div
              id="sheba-list"
              className="absolute top-full z-10 start-0 rounded-xl rounded-t-none bg-white shadow-md shadow-black/15 px-2 w-full max-h-72 overflow-auto transition"
            >
              <div className="flex justify-end w-full py-2 sticky top-0 bg-white z-10">
                <CloseCircle
                  color="red"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowShabaSuggestion(false)}
                />
              </div>
              {Array.isArray(filteredShebaItems) &&
                filteredShebaItems?.map((sheba, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedSheba({
                        name: sheba.fullname,
                        bank: sheba.bank_code,
                      })
                    }
                  >
                    <ShebaItem
                      bank_code={sheba.bank_code}
                      bank_name={sheba.bank_name}
                      avatar="/images/sample-avatar.jpg"
                      username={sheba.fullname || ''}
                      shabaNumber={sheba.shaba || ''}
                      shabaId={sheba.sid || ''}
                      onButtonClick={() => setShowShabaSuggestion(false)}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

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
                  value >= 10000000 ||
                  // value >= 10 ||
                  'مبلغ نباید کمتر از ۱۰,۰۰۰,۰۰۰ ریال باشد.',
                maximumAmount: (value) =>
                  value <= 2000000000 ||
                  'مبلغ نباید بیشتر از ۲,۰۰۰,۰۰۰,۰۰۰ ریال باشد.',
              },
            }}
            render={({ field: { onChange, value, ref } }) => {
              const cleanedValue = value ? String(value).replace(/,/g, '') : ''
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
                  <label htmlFor="username" className="block mb-3">
                    مبلغ (ریال)
                  </label>

                  <input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="مبلغ (ریال)"
                    className={`${
                      errors?.amount?.message && 'border-[#F97570]'
                    } w-full !rounded-lg px-2`}
                    autoComplete="off"
                    value={formattedValue}
                    onChange={handleOnChange}
                    aria-autocomplete="none"
                  />

                  {tomanText && (
                    <p className="text-slate-500 text-xs">{tomanText} تومان</p>
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
            rules={{}}
            render={({ field: { onChange, value, ref } }) => (
              <>
                <label htmlFor="username" className="block mb-3">
                  شرح پرداخت
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="پرداخت به دلیل"
                  className="w-full !rounded-lg"
                  autoComplete="off"
                  onChange={onChange}
                  aria-autocomplete="none"
                />
              </>
            )}
            name="description"
          />
        </div>
      </div>

      <button
        className="w-full flex justify-center !text-xs sm:!text-sm lg:!text-base !py-3 sm:!py-2 fill-button !rounded-lg"
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
  )
}

export default WithdrawForm

