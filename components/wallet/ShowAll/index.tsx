'use client'
import WalletShowAll from './WalletShowAll'
import { getAccessToken } from '@/hooks/getAccessToken'
import { GetFilteredTransactionAll, ITransactionAll } from '@/services/reports'
import eventEmitter from '../../../Event'
import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/shared/Header'
import { useStates } from '@/Context'

const WalletAll: React.FC<{ ttype: 1 | 2 | ''; status?: number }> = ({
  ttype,
  status,
}) => {
  const [transactions, setTransactions] = useState<ITransactionAll[]>()
  const { permissions } = useStates()
  const fetchTransactions = useCallback(async () => {
    const accessToken = await getAccessToken()
    const transactionsData = await GetFilteredTransactionAll({
      accessToken,
      queries: { ttype, status },
    })
    setTransactions(transactionsData || [])
  }, [ttype, status])

  useEffect(() => {
    !transactions && fetchTransactions()

    eventEmitter.on('updateTransactions', fetchTransactions)
    return () => {
      eventEmitter.off('updateTransactions', fetchTransactions)
    }
  }, [transactions, fetchTransactions])

  return (
    <>
      <Header />
      {permissions[1].includes('779') && (
        <WalletShowAll
          transactions={transactions || []}
          setData={setTransactions}
        />
      )}
    </>
  )
}

export default WalletAll