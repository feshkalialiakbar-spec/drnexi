'use client'
import { useState } from 'react'
import Invite from '../Invite'
import { ReferralList } from '@/interfaces'

const InvitesList = ({
  successList,
  waitingList,
}: {
  waitingList: ReferralList[] 
  successList: ReferralList[] 
}) => {
  const [reportTab, setReportTab] = useState(1)

  return (
    <>
      <div className='flex mb-4 sm:mb-6 border-Primary700'>
        <div
          className={`flex-1 border-b ${
            reportTab === 1 ? 'border-b-primary' : 'border-b-primary/15'
          }`}>
          <button
            className={`w-full text-center border-Primary700 !py-3 ${
              reportTab === 1 ? '!text-primary  border-b-2' : '!text-slate-400'
            }`}
            onClick={() => {
              setReportTab(1)
              location.hash = 'success'
            }}>
            دعوت های موفق
          </button>
        </div>
        <div
          className={`flex-1 border-b ${
            reportTab === 2 ? 'border-b-primary' : 'border-b-primary/15'
          }`}>
          <button
            className={`w-full text-center border-Primary700 !py-3 ${
              reportTab === 2 ? '!text-primary border-b-2' : '!text-slate-400'
            }`}
            onClick={() => {
              setReportTab(2)
              location.hash = 'waiting'
            }}>
            دعوت های در انتظار
          </button>
        </div>
      </div>
      {reportTab === 1 &&
        (successList?.length ? (
         successList?.map((referrer, index) => (
            <div className='mt-5' key={index}>
              <Invite
                key={index}
                amount={''}
                phone={referrer.customer_code}
                date={''}
                status={''}
                type={2}
              />
            </div>
          ))
        ) : (
          <p>دعوت ثبت نشده است.</p>
        ))}

      {reportTab === 2 &&
        (waitingList?.length ? (
          waitingList?.map((referrer, index) => (
            <div className='mt-5' key={index}>
              <Invite
                key={index}
                amount={''}
                phone={referrer.customer_code}
                date={''}
                status={''}
                type={1}
              />
            </div>
          ))
        ) : (
          <p>دعوتی در لیست انتظار موجود نیست.</p>
        ))}
    </>
  )
}

export default InvitesList
