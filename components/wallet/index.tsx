'use client'
import WalletBalance from './Balance'
import RecentReport from './RecentReport'
import { GetCurrentUser } from '@/services/user'
import { getCookieByKey } from '@/actions/cookieToken'
import FilterResult from '@/components/wallet/FilterResult'
import { IUserResponse } from '@/interfaces'
import { useEffect, useState } from 'react'
import { useStates } from '@/Context'
import {
  GetFilteredTransactionAll,
  GetTransactionAll,
  ITransactionAll,
} from '@/services/reports'
// import Modal from '../Modalo'

const Wallet = () => {
  const [allTransactions, setAllTransactions] = useState<ITransactionAll[]>([])
  const [open, setOpen] = useState(true)
  const [data, setData] = useState<{
    token: string | undefined
    user: IUserResponse
    lastLoginDate: string | undefined
    lastLoginTime: string | undefined
  }>()
  const [isAssistantWallet, setIsAssistantWallet] = useState<boolean>(false)

  const { permissions } = useStates()

  useEffect(() => {
    const fetchData = async () => {
      setIsAssistantWallet((await getCookieByKey('role_type')) === '0')
      try {
        const [accessToken, lastLoginDate, lastLoginTime] = await Promise.all([
          getCookieByKey('access_token'),
          getCookieByKey('lastlogin_date'),
          getCookieByKey('lastlogin_time'),
        ])
        console.log(permissions)
        if (permissions[1].includes('714')) {
          const transactions = await GetFilteredTransactionAll({
            accessToken,
            queries: {
              ttype: 1,
            },
          })
          setAllTransactions(transactions || [])
        } else {
          const transactions = await GetTransactionAll({
            accessToken,
          })
          setAllTransactions(transactions || [])
        }
        if (accessToken) {
          const user = await GetCurrentUser({ accessToken })
          if (user) {
            setData({ token: accessToken, user, lastLoginDate, lastLoginTime })
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [permissions])

  //   const text = `🔔 اطلاعیه
  //  از امروز سه‌شنبه ۲۵ شهریور امکان ثبت برداشت فراهم است.
  // درخواست‌های ثبت‌شده تا ساعت ۲۴ هر روز، صبح روز بعد واریز می‌شوند.
  // ⚠️ در تعطیلات رسمی برداشت انجام نمی‌شود و واریز در اولین روز کاری بعد صورت می‌گیرد.
  // به‌زودی با سرویس‌های جدید بانکی، برداشت‌ها اتوماتیک خواهد شد
  // `

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false) // مودال بسته شه
      }, 24000)

      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <>
      {/* {!isAssistantWallet && ( */}
      {/* <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="اطلاعیه"
        message={text}
        dir="rtl"
      /> */}
      {/* )} */}

      {/* <Modal
        open={open}
        onClose={() => setOpen(false)}
        title='اطلاعیه'`
        message={text}
        dir='rtl'
      /> */}
      {permissions[1]?.includes('782') && (
        <WalletBalance
          username={data?.user?.first_name + ' ' + data?.user?.last_name}
          walletName={data?.user?.full_name || ''}
          accessToken={data?.token || ''}
          showBackBtn={false}
          lastLoginDate={data?.lastLoginDate}
          lastLoginTime={data?.lastLoginTime}
          flexType={1}
        />
      )}
      <FilterResult />
      {permissions[1].includes('714') && !permissions[1].includes('773') && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm leading-relaxed space-y-2 max-w-xl mx-auto">
          <div className="flex items-start gap-2 font-semibold">
            <span className="text-lg">ℹ️</span>
            <span>راهنمای کیف پول شما</span>
          </div>
          <p>• این کیف پول مخصوص شماست؛ فضای امن درآمد و تلاش‌های شما.</p>
          <p>
            • تمام پورسانت‌ها و تراکنش‌ها فقط برای شما ثبت می‌شوند و ارتباطی با
            صاحب اکانت ندارند.
          </p>
          <p>
            • هر زمان که خواستید، می‌توانید برداشت کنید و از نتیجه زحماتتان لذت
            ببرید.
          </p>
          <p>
            • هر تراکنش موفق، گامی‌ست به‌سوی پورسانت بیشتر و پیشرفت حرفه‌ای‌تر
            🚀
          </p>
        </div>
      )}
      {!isAssistantWallet && permissions[1].includes('775') && !permissions[1].includes('773') && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm leading-relaxed space-y-2 max-w-xl mx-auto mt-6">
          <div className="flex items-start gap-2 font-semibold">
            <span className="text-lg">ℹ️</span>
            <span>راهنما</span>
          </div>
          <p>
            • می‌توانید برای هر کاربر از ۶۰۰ هزار تا ۲۰۰ میلیون تومان لینک
            دریافت وجه بسازید.
          </p>
          <p>• هر کاربر ۸ ساعت فرصت تکمیل دارد.</p>
          <p>
            • پس از پرداخت، برای شما پیامک تأیید واریز ارسال می‌شود و نیازی به
            بررسی مداوم کیف پول نیست.
          </p>
          <p>
            • تراکنش‌های ناموفق یا لغوشده معتبر نیستند؛ در صورت نیاز، لینک را
            دوباره ارسال کنید.
          </p>
          <p>• پس از ارسال لینک، لطفاً به کاربران اطلاع دهید.</p>
          <p>
            • واریزی‌های منقضی نیز پس از ۸ ساعت وارد می‌شوند؛ فقط کافی‌ست «ارسال
            مجدد» بزنید.
          </p>
        </div>
      )}
      {permissions[1].includes('713') && (
        <RecentReport
          allTransactions={allTransactions.filter(
            (transaction) => transaction.ttype === '1'
          )}
          label="واریز های اخیر"
          ttype={1}
          showTab={true}
        />
      )}
      {permissions[1].includes('714') && (
        <RecentReport
          allTransactions={allTransactions.filter(
            (transaction) => transaction.ttype !== '1'
          )}
          label="برداشت های اخیر"
          ttype={2}
          showTab={false}
        />
      )}
    </>
  )
}
export default Wallet
