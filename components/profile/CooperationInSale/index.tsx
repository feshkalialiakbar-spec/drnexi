'use client'
import { getCookieByKey } from '@/actions/cookieToken'
import Header from '@/components/shared/Header'
import { ArrowRight2 } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InvitesList from './List'
import { ReferralList } from '@/interfaces'
import { GetRefferalList } from '@/services/user'
import { useStates } from '@/Context'
const CooperationInSale = () => {
  const { permissions } = useStates()
  const [mobile, setMobile] = useState<string>()
  const [referralList, setReferralList] = useState<{
    success: ReferralList[]
    waiting: ReferralList[]
  }>()
  const [isSecretary, setIsSecretary] = useState<boolean>(false)
  const fetchData = useCallback(async () => {
    const token = await getCookieByKey('access_token')
    const number = await getCookieByKey('mobile')
    !mobile && setMobile(number)
    if (token) {
      const list = await GetRefferalList({ accessToken: token })
      if (list) {
        setReferralList({
          success: list.filter(
            (referrer) => referrer.customers_dep_status_wsb === 1
          ),
          waiting: list.filter(
            (referrer) => referrer.customers_dep_status_wsb === 0
          ),
        })
      }
    }
  }, [setMobile, mobile, setReferralList])
  useEffect(() => {
    setIsSecretary(location.pathname.includes('secretary'))
    fetchData()
  }, [fetchData])
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '',
          text: `دوست جدید دکترنکسی سلام و وقت بخیر
برای پیوستن به دکترنکسی با کلیک بر روی لینک زیر ثبت نام کنید و منتظر تایید بمانید. به محض تایید می توانید از خدمات این پلتفرم بهره مند شوید.`,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-up?referrer=${mobile}`,
        })
      } catch (error) {
        console.error('Error sharing receipt:', error)
      }
    } else {
      console.error('API اشتراک‌گذاری توسط این مرورگر پشتیبانی نمی‌شود.')
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-up?referrer=${mobile}`
      navigator.clipboard.writeText(shareUrl)
      toast.success('لینک با موفقیت کپی شد')
    }
  }

  return (
    <>
      <Header />
      {permissions[1]?.includes('709') && (
        <>
          <button
            className='font-medium text-primary inline-flex items-center gap-2 cursor-pointer text-Primary700'
            onClick={() => (location.href = `/profile`)}>
            <ArrowRight2 className='sm:text-lg' />
            {isSecretary ? 'دعوت از مشتریان' : 'دعوت از دوستان '}
          </button>
          <p className='p-5 pb-0'>
            برای کسب درآمد از CashBack ، کافیست دوستانتان را به پنل دکترنکسی دعوت
            کنید.
            <br />
            با تکمیل فرآیند ثبت نام و آغاز تراکنش‌های مالی آن‌ها، شما در درآمد
            آینده ایشان همواره سهیم خواهید بود.
          </p>
          <button
            className='w-full fill-button text-white py-4 my-10 rounded-lg '
            onClick={handleShare}>
            اشتراک‌گذاری دعوت‌نامه
          </button>
          <div className='flex flex-col mb-12 px-5 py-7 border rounded-lg'>
            <div className='flex justify-between border-b-2 pb-7 mb-7 '>
              <p className='text-slate-400'>دعوت‌های موفق به دکترنکسی</p>
              <b>{referralList?.success?.length} نفر</b>
            </div>
            <div className='flex justify-between mb-1 '>
              <p className='text-slate-400'>
                دعوت‌های درانتظار پیوستن به دکترنکسی
              </p>
              <b>{referralList?.waiting?.length} نفر</b>
            </div>
            {/* <div className='flex justify-between border-b-1 '>
          <p className='text-slate-400'>پورسانت دریافت شده</p>
          <b>{'15,000,000,000 ریال'}</b>
        </div> */}
          </div>
          <div className='h-max mb-20'>
            <InvitesList
              successList={referralList?.success || []}
              waitingList={referralList?.waiting || []}
            />
          </div>
        </>
      )}
    </>
  )
}

export default CooperationInSale
