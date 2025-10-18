'use client'
import { getCookieByKey } from '../../../actions/cookieToken'
import OTPInput from '../../shared/OTPinput'
import SingleSelectList from '../shared/SingleSelectList'
import { setComma } from '../hooks/NumberFormat'
import { CustomerList, ShebaListScheme } from '../interface'
import {
  CreateWithdrawRequest,
  GetCustomerRemain,
  GetCustomers,
  GetShebaList,
  SendWithdrawOtp,
} from '../services/withdraw'
import { FilteredItems } from '../types'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { errorClass } from '@/components/Atministiyaramiyeytor/assets/style'

const MultiStepForm = () => {
  const [step, setStep] = useState(1)
  const [timeLeft, setTimeLeft] = useState(87)
  const [disableOtpInput, setDisableOtpInput] = useState<boolean>(false)
  const [showSendOtpButton, setShowSendOtpButton] = useState(true)
  const [filteredItems, setFilteredItems] = useState<{
    customers: FilteredItems[]
    shabaList: FilteredItems[]
  }>({ customers: [], shabaList: [] })
  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }
  const [errors, setErrors] = useState<string[]>([])
  const [itemsValue, setItemsValue] = useState<{
    customers: CustomerList[]
    shebaList: ShebaListScheme[]
  }>({ customers: [], shebaList: [] })
  const [remain, setRemain] = useState<string>('')
  const [formData, setFormData] = useState({
    app: 'شهر هفتم',
    manageruid: '',
    otp_code: '',
    amount: '',
    description: '',
    payment_method: 1,
    withdrawal_bank: '',
    withdrawal_address: '',
    withdrawal_name: '',
    app_uid: 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) =>
      (
        (c === 'x' ? Math.random() * 16 : ((Math.random() * 16) & 0x3) | 0x8) |
        0
      ).toString(16)
    ),
    user_uid: '09361119235',
    cust_tinb: '',
    cust_tob: 1,
    cust_address: '',
    cust_tel: '',
    cust_bid: '',
    cust_bpc: '',
    cust_bbc: '',
    cust_bpn: '',
  })

  const validateRequiredFields = () => {
    const required = ['manageruid', 'amount', 'withdrawal_address']
    const missing = required.filter(
      (field) => !formData[field as keyof typeof formData]
    )

    setErrors(missing)
    return missing.length === 0
  }

  const sendOtp = async () => {
    if (!validateRequiredFields()) {
      toast.error('لطفا فیلد های الزامی را پرکنید')
      setStep(1)
      return
    }

    setDisableOtpInput(true)
    const accessToken = (await getCookieByKey('access_token')) || ''
    const response = await SendWithdrawOtp({
      accessToken,
      manageruid: formData.manageruid,
    })

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

  const fetchData = useCallback(async () => {
    const accessToken = (await getCookieByKey('access_token')) || ''
    const customers = await GetCustomers({ accessToken })
    if (customers) {
      setItemsValue({
        customers,
        shebaList: itemsValue.shebaList,
      })
      setFilteredItems((prv) => ({
        ...prv,
        customers: customers.map((items: CustomerList) => ({
          id: items.manager_uid,
          label: items.customer_name,
        })),
      }))
    }
  }, [itemsValue])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors.includes(name)) {
      setErrors((prev) => prev.filter((err) => err !== name))
    }
  }

  const getCustomerDetail = async (manageruid: string) => {
    const accessToken = (await getCookieByKey('access_token')) || ''
    const remainResult = await GetCustomerRemain({ accessToken, manageruid })
    const shebaResult = await GetShebaList({ accessToken, manageruid })

    setItemsValue((prev) => ({
      ...prev,
      shebaList: shebaResult || [],
    }))
    setFilteredItems((prv) => ({
      ...prv,
      shabaList: shebaResult.map((items: ShebaListScheme) => ({
        id: items.shaba,
        label: items.shaba + ' - ' + items.bank_name + ' - ' + items.fullname,
      })),
    }))
    setRemain(remainResult?.max_amount || '')
  }

  const makeWithdraw = async () => {
    const accessToken = (await getCookieByKey('access_token')) || ''
    await CreateWithdrawRequest({
      accessToken,
      ...formData,
      amount: parseInt(formData.amount.replaceAll(',', '')),
    }).then(async (result) => {
      if (result?.status === '1') {
        toast.success(result?.message)
        setStep(1)
        await fetchData()
      } else toast.error(result?.message)
    })
  }

  const getClass = (field: string) =>
    `w-full border rounded px-3 py-2 ${
      errors.includes(field) ? errorClass : 'border-gray-300'
    }`

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="w-full flex justify-around items-center mb-6 ">
        <div className="border border-dashed w-full absolute max-w-[850px]"></div>
        {['اطلاعات اولیه', 'اطلاعات دریافت‌ کننده', 'کد تایید'].map(
          (section, index) => (
            <div className="flex flex-col items-center" key={index}>
              <div
                onClick={() => setStep(index + 1)}
                className={`w-10 h-10 z-30 p-6 flex items-center justify-center rounded-full border-4  border-white mt-5 cursor-pointer ${
                  step >= index + 1
                    ? ' bg-[#DDE6FF]  text-[#2F27CE]'
                    : 'bg-[#F5F7F8] text-[#50545F]'
                }`}
              >
                {index + 1}
              </div>
              <p className=" text-[#2F27CE]">{section}</p>
            </div>
          )
        )}
      </div>

      {/* Form Sections */}
      {step === 1 && (
        <div className="w-full  p-4 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              مربوط به کدام اپلیکیشن می‌باشد؟
            </label>
            <div className="flex justify-around ">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="app"
                  value="شهر هفتم"
                  onChange={handleChange}
                  className="accent-[#2F27CE] w-5 cursor-pointer "
                  defaultChecked={formData.app === 'شهر هفتم'}
                />
                شهر هفتم
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="app"
                  value="دکترنکسی"
                  onChange={handleChange}
                  className="accent-[#2F27CE] w-5 cursor-pointer "
                  checked={formData.app === 'دکترنکسی'}
   />
                دکترنکسی
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-1 my-4 font-medium">مشتری *</label>
            <SingleSelectList
              className={getClass('manageruid')}
              items={itemsValue.customers.map((items) => ({
                id: items.manager_uid,
                label: items.customer_name,
              }))}
              label={formData.manageruid || 'نام مشتری'}
              setSelectedItems={(value: string | number) => {
                getCustomerDetail(value as string)
                setFormData((prev) => ({
                  ...prev,
                  ['manageruid' as keyof typeof formData]: value,
                }))
                if (errors.includes('manageruid')) {
                  setErrors((prev) =>
                    prev.filter((err) => err !== 'manageruid')
                  )
                }
              }}
              filteredItems={filteredItems.customers}
              setFilteredItems={(customers) =>
                setFilteredItems((prv) => ({ ...prv, customers }))
              }
            />
            {remain && (
              <div className="flex mt-1 jutify-between w-[100%]  border-b rounded-full border-b-blue-200 shadwo-lg  shadow-blue-200  pb-1">
                <div className="w-full bg-[#8893c513] text-[#142661] rounded-r-lg flex  justify-center items-center border-2 border-[#d1e7f7] border-l-none border-b-none">
                  موجودی :
                </div>
                <div className="w-full bg-[#244b7e] py-1 rounded-l-lg flex  justify-center items-center border-2 border-[#233d77] text-[#ffffff]">
                  {setComma(remain)} ریال
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="flex items-center mb-1 font-medium ">
              * شماره شبا
            </label>
            <SingleSelectList
              className={getClass('withdrawal_address')}
              items={itemsValue.shebaList.map((items) => ({
                id: items.shaba,
                label:
                  items.shaba +
                  ' - ' +
                  items.bank_name +
                  ' - ' +
                  items.fullname,
              }))}
              label={formData.withdrawal_address || 'شماره شبا '}
              setSelectedItems={(value: string | number) => {
                const selected = itemsValue.shebaList.find(
                  (s) => s.shaba === value
                )
                setFormData((prev) => ({
                  ...prev,
                  withdrawal_bank: selected?.bank_name || '',
                  withdrawal_name: selected?.fullname || '',
                  withdrawal_address: `${value}`,
                }))
                if (errors.includes('withdrawal_address')) {
                  setErrors((prev) =>
                    prev.filter((err) => err !== 'withdrawal_address')
                  )
                }
              }}
              filteredItems={filteredItems.shabaList}
              setFilteredItems={(shabaList) =>
                setFilteredItems((prv) => ({ ...prv, shabaList }))
              }
            />
          </div>
          <div className="my-4">
            <label className="block mb-1 font-medium">مبلغ</label>
            <input
              name="amount"
              value={setComma(formData.amount.replaceAll(',', ''))}
              onChange={handleChange}
              className={`w-full border rounded ${getClass('amount')}`}
            />
          </div>

          <div className="my-4">
            <label id="status-label">نوع برداشت</label>
            <select
              className={`!w-full outline-none border rounded h-10 px-1 cursor-pointer border-[#C9D0D8]`}
              name={''}
              onChange={handleChange}
            >
              <option value=""> شبا</option>
              <option value="0">کارت</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">بانک مقصد</label>
            <input
              disabled
              name="withdrawal_bank"
              value={formData.withdrawal_bank}
              className="w-full border bg-gray-300 cursor-not-allowed border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleNextStep}
            className="w-full my-5 cursor-pointer fill-button py-2 rounded"
          >
            ادامه
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full p-4 rounded-lg shadow">
          <div className="my-4">
            <label className="block mb-1 font-medium">
              نوع شخص دریافت کننده
            </label>
            <select
              name="cust_tob"
              value={formData.cust_tob}
              onChange={handleChange}
              className={getClass('cust_tob')}
            >
              <option value="1">حقیقی</option>
              <option value="2">حقوقی</option>
              <option value="3">مشارکت مدنی</option>
              <option value="4">اتباع غیر ایرانی</option>
              <option value="5">سایر</option>
            </select>
          </div>
          <div className="my-4">
            <label className="block mb-1 font-medium">
              شماره اقتصادی دریافت‌کننده وجه
            </label>
            <input
              name="cust_tinb"
              placeholder="۲۳۴۵۱۳۴۵۱۳۵"
              value={formData.cust_tinb}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="my-4">
            <label className="block mb-1 font-medium">
              آدرس دریافت‌کننده وجه
            </label>
            <input
              name="cust_address"
              placeholder="صالح آبادی"
              value={formData.cust_address}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex my-4 gap-7">
            <div className="w-full">
              <label className="block mb-1 font-medium">
                کد پستی دریافت‌کننده وجه
              </label>
              <input
                name="cust_bpc"
                placeholder="۵۴۳۲۳۴۵۴۶۵"
                value={formData.cust_bpc}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 font-medium">
                شماره تماس دریافت‌کننده وجه
              </label>
              <input
                name="cust_tel"
                placeholder="۰۹۱۲۰۹۷۳۵۷۲۰۴"
                value={formData.cust_tel}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
          <button
            onClick={handleNextStep}
            className="w-full fill-button my-4 h-10 rounded"
          >
            ادامه
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="w-full p-4 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-1 font-medium">بابت</label>
            <input
              name="description"
              placeholder="بابت چه چیزی واریز می‌کنید"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-14 sm:mb-16">
            <label htmlFor="otp_code" className="mb-2 inline-block">
              کد تایید
            </label>
            <div className="flex items-end sm:items-center sm:justify-between flex-col sm:flex-row">
              <div>
                <OTPInput
                  setResult={(result: string) => {
                    if (result.length > 5 && result !== formData.otp_code) {
                      setFormData((prev) => ({ ...prev, otp_code: result }))
                    }
                  }}
                />
              </div>
              {showSendOtpButton ? (
                <button
                  className="!mt-4 sm:!mt-0 !rounded-lg fill-button h-10 min-w-40"
                  disabled={disableOtpInput}
                  onClick={sendOtp}
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
          </div>
          <button
            onClick={makeWithdraw}
            className="w-full fill-button h-10 rounded"
          >
            ثبت برداشت
          </button>
        </div>
      )}
    </div>
  )
}

export default MultiStepForm
