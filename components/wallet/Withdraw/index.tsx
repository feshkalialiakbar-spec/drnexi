'use client'

import { getAccessToken } from '@/hooks/getAccessToken'
import { GetCurrentUser } from '@/services/user'
import { IUserResponse } from '@/interfaces'
import { useWithdrawStepTwo } from '@/hooks/useWithdrawHooks'
import WalletBalance from '../../wallet/Balance'
import WithdrawLastCheck from './WithdrawLastCheck'
import WithdrawForm from './Form'
import React, { useCallback, useEffect, useState } from 'react'
import { useStates } from '@/Context'

const WalletWithdrawPage = () => {
  const { showWithdrawStepTwo } = useWithdrawStepTwo()
  const { permissions } = useStates()
  const [data, setData] = useState<{
    accessToken: string
    user: IUserResponse
  }>()

  const getToken = useCallback(async () => {
    const accessToken = await getAccessToken()
    const user = await GetCurrentUser({ accessToken })
    user &&
      setData({
        accessToken: accessToken || '',
        user,
      })
  }, [setData])
  useEffect(() => {
    !data && getToken()
  }, [getToken, data])

  return (
    <>
      <WalletBalance
        walletName={data?.user?.full_name || ''}
        username={data?.user?.full_name || ''}
        accessToken={data?.accessToken || ''}
        showUsername={false}
        showBackBtn={true}
        flexType={1}
      />

      {permissions[1]?.includes('778')&& showWithdrawStepTwo ? (
        <WithdrawLastCheck
          accessToken={data?.accessToken || ''}
          userMobile={data?.user?.mobile || ''}
        />
      ) : (
        <WithdrawForm />
      )}
    </>
  )
}

export default WalletWithdrawPage
