import { getAccessToken } from '@/hooks/getAccessToken'
import { GetCurrentUser } from '@/services/user'
import MainLayout from '@/layouts/MainLayout'
import ProfileShowQRCode from '@/components/profile/ProfileShowQRCode'


const ProfileQrPage = async () => {
  const accessToken = await getAccessToken()
  const user = await GetCurrentUser({ accessToken })

  return (
   <MainLayout>
      {user && <ProfileShowQRCode user={user} />}
    </MainLayout>
  )
}

export default ProfileQrPage
