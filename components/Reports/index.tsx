'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import ShowAllReports from './ShowAllReports'
import { getAccessToken } from '@/hooks/getAccessToken'
import { GetFilteredTransactionAll, ITransactionAll } from '@/services/reports'
import { useStates } from '@/Context'

const Reports = () => {
  const { permissions } = useStates()
  const [state, setState] =
    useState<{ data: ITransactionAll[]; tabName: string }[]>()
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isAssistantWallet, setIsAssistantWallet] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const allTransactionsRef = useRef<ITransactionAll[] | undefined>(undefined)
  const depositDataRef = useRef<ITransactionAll[] | undefined>(undefined)
  const withdrawDataRef = useRef<ITransactionAll[] | undefined>(undefined)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const accessToken = await getAccessToken()

    if (
      !allTransactionsRef.current &&
      ['722', '723'].every((code) => permissions[1]?.includes(code))
    ) {
      allTransactionsRef.current = await GetFilteredTransactionAll({
        accessToken,
        queries: { ttype: '' },
      })
    }
    if (!depositDataRef.current && permissions[1]?.includes('723')) {
      depositDataRef.current = await GetFilteredTransactionAll({
        accessToken,
        queries: { ttype: 1 },
      })
    }
    if (!withdrawDataRef.current && permissions[1]?.includes('722')) {
      withdrawDataRef.current = await GetFilteredTransactionAll({
        accessToken,
        queries: { ttype: 2 },
      })
    }
    const result = ['722', '723'].every((code) => permissions[1]?.includes(code))
      ? [
          { data: allTransactionsRef.current || [], tabName: 'همه' },
          { data: depositDataRef.current || [], tabName: 'واریزی' },
          { data: withdrawDataRef.current || [], tabName: 'برداشتی' },
        ]
      : permissions[1]?.includes('723')
      ? [{ data: depositDataRef.current || [], tabName: 'واریزی' }]
      : permissions[1]?.includes('722')
      ? [{ data: withdrawDataRef.current || [], tabName: 'برداشتی' }]
      : []
    setState(result)
    setLoading(false)
  }, [permissions])

  useEffect(() => {
    fetchData()

    if (!location.hash.substring(1)) {
      location.hash = 'all'
    }

    const handleHashChange = () => {
      const tag = location.hash.substring(1)

      if (tag === 'all') setSelectedTab(0)
      if (tag === 'deposite') setSelectedTab(1)
      if (tag === 'withdraw') setSelectedTab(2)
    }

    window.addEventListener('hashchange', handleHashChange, false)
    handleHashChange()
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false)
    }
  }, [fetchData, isAssistantWallet])

  const filterData = (data: ITransactionAll[]) => {
    setState((prev) =>
      prev?.map((item, index) =>
        index === selectedTab ? { ...item, data } : item
      )
    )
  }

  const changeTab = (tab: number) => {
    setSelectedTab(tab)
    if (tab === 0) location.hash = 'all'
    if (tab === 1) location.hash = 'deposite'
    if (tab === 2) location.hash = 'withdraw'
  }

  return (
    <>
      {permissions[1]?.includes('781') && (
        <ShowAllReports
          loading={loading}
          setData={filterData}
          reports={state || []}
          tab={selectedTab}
          setTab={changeTab}
        />
      )}
    </>
  )
}

export default Reports
