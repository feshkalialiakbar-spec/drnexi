import AddShebaForm from './AddShebaForm'
import Link from 'next/link'
import { getAccessToken } from '@/hooks/getAccessToken'
import { GetCurrentUser } from '@/services/user'
import { ArrowRight2 } from 'iconsax-react'

const ShebaList = async () => {
  const accessToken = await getAccessToken()
  const user = await GetCurrentUser({ accessToken })

  return (
    <>
      <Link
        className='inline-flex items-center gap-2 mb-8 lg:mb-10 font-medium text-primary'
        href='/wallet/sheba'>
        <ArrowRight2 size='24' color='#2f27ce' />
        افزودن شبا جدید
      </Link>

      <AddShebaForm
        userMobile={user?.mobile || ''}
        accessToken={accessToken as string}
      />
    </>
  )
}

export default ShebaList
