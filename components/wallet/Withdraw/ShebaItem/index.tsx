'use client'

import { bankImages } from '@/components/shared/MatchingBankLogo'
import { useKeepWithdrawFormData } from '@/hooks/useWalletHooks'
import Image from 'next/image'

interface IShebaButtonItem {
  avatar: string
  username: string
  shabaNumber: string
  shabaId: string
  bank_name: string
  bank_code: string
  onButtonClick: () => void
}

const ShebaItem = ({
  avatar,
  shabaNumber,
  username,
  shabaId,
  bank_name,
  bank_code,
  onButtonClick,
}: IShebaButtonItem) => {
  const { withdrawForm, setWithdrawForm } = useKeepWithdrawFormData()

  const setShebaToGlobalVar = () => {
    setWithdrawForm({
      ...withdrawForm,
      shebaNumber: shabaNumber.slice(2),
      shebaId: shabaId,
      shebaUsername: username,
      bankName: bank_name,
    })
    onButtonClick()
  }

  return (
    <div
      className='w-full flex flex-col items-center mb-1 last-of-type:mb-0 border-b border-b-1 text-[#2F27CE] hover:bg-blue-100'
      onClick={setShebaToGlobalVar}>
      <div className='w-full flex items-center gap-2 mb-2'>
        <Image
          src={avatar || '/images/sample-avatar.jpg'}
          width={40}
          height={40}
          alt={username || ''}
          title={username || ''}
          className='inline-block rounded-full w-[2vw] h-[2vw]   max-md:w-[5vw] max-md:h-[5vw]'
        />
        <div className='w-full flex justify-between items-center'>
          <div className='flex flex-col'>
            <p className=''>{username || ''}</p>
            <p className='text-slate-400'>{shabaNumber || ''}</p>
          </div>

          <div className='flex gap-2 items-center'>
            بانک {bank_name}
            <Image
              src={bankImages[bank_code] || ''}
              width={40}
              height={40}
              alt={username || ''}
              title={username || ''}
              className='inline-block rounded-full w-[2vw] h-[2vw]  max-md:w-[5vw] max-md:h-[5vw]'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShebaItem
