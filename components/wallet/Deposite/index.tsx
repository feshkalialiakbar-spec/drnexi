'use client'
import { getAccessToken } from '@/hooks/getAccessToken'
import DepositForm from './Form'
import DepositShowQrCode from './ShowQrCode'
import { useToggleDepositForm } from '@/hooks/useWalletHooks'
import { useCallback, useEffect, useState } from 'react'
import { useStates } from '@/Context'

const Desposit = () => {
  const [token, setToken] = useState<string>()
  const { permissions } = useStates()
  const getToken = useCallback(async () => {
    const accessToken = await getAccessToken()
    setToken(accessToken)
  }, [setToken])
  useEffect(() => {
    !token && getToken()
  }, [getToken, token])
  const { showDepositForm } = useToggleDepositForm()

  return (
    <>
      {permissions[1]?.includes('775') && (
        <>
          {showDepositForm ? (
            <DepositForm accessToken={token || ''} />
          ) : (
            <DepositShowQrCode />
          )}
        </>
      )}
    </>
  )
}

export default Desposit
