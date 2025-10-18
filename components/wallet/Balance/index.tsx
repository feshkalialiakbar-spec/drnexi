'use client'
import { useCallback, useEffect, useState } from 'react'
import {
  ArrowRight2,
  EmptyWallet,
  Eye,
  EyeSlash,
  ReceiptSearch,
} from 'iconsax-react'
import { GetAccountBalance, GetNoneRemovableBalance } from '@/services/reports'
import ShowNumber from '../ShowAnimateNumber'
import { useKeepWithdrawFormData } from '@/hooks/useWalletHooks'
import { useWithdrawStepTwo } from '@/hooks/useWithdrawHooks'
import { IWalletBalance } from '@/interfaces'
import { useStates } from '@/Context'
import { getCookieByKey } from '@/actions/cookieToken'

const WalletBalance = ({
  username,
  walletName,
  showUsername = true,
  showBackBtn = true,
  lastLoginDate,
  lastLoginTime,
  flexType,
  accessToken,
}: IWalletBalance) => {
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState<{
    removable: number
    allBalance: number
  }>()
  const { permissions } = useStates()
  const { setWithdrawForm } = useKeepWithdrawFormData()
  const { setShowWithdrawStepTwo, showWithdrawStepTwo } = useWithdrawStepTwo()
  const [isAssistantWallet, setIsAssistantWallet] = useState<boolean>(false)
  const getBalance = useCallback(async () => {
    setIsAssistantWallet((await getCookieByKey('role_type')) === '0')
    if (accessToken) {
      const accountBalance = await GetAccountBalance({ accessToken })
      const noneRemovable = await GetNoneRemovableBalance({ accessToken })
      accountBalance &&
        accountBalance[0] &&
        noneRemovable &&
        setBalance({
          allBalance: Number(accountBalance[0]?.amount) || 0,
          removable: Number(noneRemovable[0]?.amount) || 0,
        })
    }
  }, [setBalance, accessToken])
  useEffect(() => {
    !balance && getBalance()
  }, [getBalance, balance])
  const onGoBack = () => {
    if (showWithdrawStepTwo) {
      setShowWithdrawStepTwo(false)
      setWithdrawForm({
        shebaId: '',
        shebaNumber: '',
        amount: 0,
        description: '',
        shebaUsername: '',
      })
    } else {
      location.hash.includes('my')
        ? (location.href = `/my-wallet`)
        : (location.href = `/wallet`)
    }
  }

  return (
    <>
      {showBackBtn && (
        <button
          className='!font-medium !text-primary !inline-flex !items-center !gap-2 !mb-8 lg:!mb-10 !rounded-lg'
          onClick={onGoBack}>
          <ArrowRight2 size='24' color='#2f27ce' />
          برداشت
        </button>
      )}

      <div className='rounded-2xl bg-primary/5 overflow-hidden mb-6 sm:mb-8'>
        <div className='p-4'>
          {showUsername && username && (
            <p className='mb-2 font-medium sm:text-base'>
              <span>{username.replace(/\b(null|undefined)\b/g, '')}</span> عزیز
              خوش آمدید
            </p>
          )}
          {lastLoginDate && (
            <p className='mb-4 font-light'>
              آخرین ورود:
              <span className='me-2' dir='ltr'>
                {lastLoginTime} | {lastLoginDate}
              </span>
            </p>
          )}
          <div className='flex items-center justify-between'>
            <p className='flex items-center'>
              <EmptyWallet size='24' color='#111111' />
              <span className='ms-2 font-medium text-sm sm:text-base'>
                {' کیف پول '}
                {walletName}
              </span>
            </p>
            {permissions[1]?.includes('715') && (
              <button
                className='!px-0 !rounded-lg'
                onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? (
                  <Eye size={24} color='#111111' />
                ) : (
                  <EyeSlash size={24} color='#111111' />
                )}
              </button>
            )}
          </div>
        </div>
        <div
          className={`${
            isAssistantWallet ? 'bg-[#023114]' : 'bg-primary'
          } text-white flex items-center ${
            flexType === 1 ? 'justify-between p-4' : 'justify-center gap-2'
          }`}>
          <p className='text-sm sm:text-base sm:mb-2'>موجودی قابل برداشت </p>
          <div className='flex  gap-1 items-center font-bold text-lg sm:text-2xl'>
            {permissions[1]?.includes('717') && showBalance ? (
              <>
                <ShowNumber
                  targetValue={Number(balance?.allBalance) || 0}
                  startValue={Number(balance?.allBalance) * 0.9 || 0}
                  incrementValue={Number(balance?.allBalance) * 0.01}
                  interval={1}
                />
                <small className='text-xs sm:text-sm'>ریال</small>
              </>
            ) : (
              <span>******</span>
            )}
          </div>
        </div>
        {permissions[1]?.includes('716') && (
          <div
            className={`${
              isAssistantWallet ? ' bg-[#023114] ' : ' bg-primary '
            }ّ 
             text-white  flex items-center justify-between ${
               flexType === 1 ? 'p-4' : ' px-4'
             }`}>
            <p
              onClick={() => (location.href = `/wallet/all/charging`)}
              className='cursor-pointer sm:text-xs sm:mb-2 flex items-center gap-2'>
              موجودی در حال شارژ
              <ReceiptSearch />
            </p>
            <p className='font-bold  sm:text-xs'>
              {showBalance ? (
                <>
                  <span>
                    {balance?.removable
                      ?.toLocaleString('en-US')
                      .split('.')[0] || 0}
                  </span>
                  <small className='text-xs sm:text-xs'> ریال </small>
                </>
              ) : (
                <span>******</span>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default WalletBalance
