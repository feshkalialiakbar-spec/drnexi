'use client'
import { useEffect, useMemo, useState } from 'react'
import PaymentDetails from './Reciept'
import { useKeepReceiptData } from '@/hooks/useReceipt'
import Header from '@/components/shared/Header'
import PaymentReceipt from './ReceiptDetail'

const ShowReceipt = () => {
  const [state, setState] = useState<0 | 1>(0)
  const [data, setData] = useState<any>()
  const { receiptData } = useKeepReceiptData()
  const receipt = useMemo(
    () => ({
      amount: receiptData?.amount || '',
      pan: receiptData?.pan || '',
      remain: receiptData?.remain || '',
      transactionDate_pe: receiptData?.transactionDate_pe || '',
      transactionTime: receiptData?.transactionTime || '',
      transaction_code: receiptData?.transaction_code || '',
      transaction_cost:receiptData?.transaction_cost||'',
      description:receiptData?.description  ||'',
      tstatus: receiptData?.tstatus || '',
      user_uid: receiptData?.user_uid || '',
      wage_cost: receiptData?.wage_cost || '',
      tracking_number: receiptData?.tracking_number || '',
      originalAmount: receiptData?.originalAmount || '',
      withdrawal_address: receiptData?.withdrawal_address || '',
      avatarUrl: receiptData?.avatarUrl || '',
      ttype: receiptData?.ttype || '',
    }),
    [receiptData]
  )

  const getCookieValue = (key: string): string | undefined => {
    const Detail: Record<string, string> = document.cookie
      .split(';')
      .map((cookie) => cookie.split('='))
      .reduce((acc: Record<string, string>, [cookieKey, cookieValue]) => {
        acc[cookieKey.trim()] = decodeURIComponent(cookieValue)
        return acc
      }, {})

    return Detail[key]
  }
  useEffect(() => {
    if (location.hash.substring(1) === 'payment') {
      const payDetail = JSON.parse(getCookieValue('deposit-receipt') || '{}')
      setData(payDetail)
    } else {
      setData(receipt)
    }
  }, [receipt])
  const changeState = (number: 0 | 1) => {
    setState(number)
  }
  return (
    <>
    <Header/>
      {state === 0 ? (
        <PaymentDetails setState={changeState} data={data} />
      ) : (
        <PaymentReceipt data={data} setState={changeState} />
      )}
    </>
  )
}

export default ShowReceipt