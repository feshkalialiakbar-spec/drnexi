'use client'

import { Porsant } from '@/components/shared/IconGenerator'

interface Props {
  amount: string
  phone: string
  date: string
  status: string
  type: 1 | 2
}
const Invite: React.FC<Props> = ({ amount, phone, date, status, type }) => {
  return (
    <>
      <div className='flex w-full justify-between items-center'>
        <div className='flex gap-2'>
          <div
            className={`h-12 w-12 flex items-center justify-center rounded-full ${
              type === 1 ? 'bg-[#EDF0F2]' : 'bg-[#DAFEE5] '
            }`}>
            <Porsant color={`${type === 1 ? '#2F3237' : '#0CAD41'}`} />
          </div>
          <div className='flex flex-col justify-center items-start'>
            <bdi className='font-bold'>{phone}</bdi>
            <p className='text-slate-400'>{date}</p>
          </div>
        </div>
        <p>{amount}</p>
      </div>
    </>
  )
}

export default Invite
