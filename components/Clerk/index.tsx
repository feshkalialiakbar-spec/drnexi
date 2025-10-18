import MainLayout from '@/layouts/MainLayout'
import ClerkActions from './ClerkActions'
import ClerkList from './ClerkList'
import { getAccessToken } from '@/hooks/getAccessToken'

const Clerk = async () => {
  const accessToken = await getAccessToken()

  return (
    <MainLayout>
      <ClerkActions />
      <ClerkList accessToken={accessToken} />
    </MainLayout>
  )
}

export default Clerk
