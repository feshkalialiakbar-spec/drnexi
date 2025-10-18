import MainLayout from '@/layouts/MainLayout'
import ChangePasswordForm from '../../../components/profile/ChangePasswordForm'
import { getAccessToken } from '@/hooks/getAccessToken'
import { getCookieByKey } from '@/actions/cookieToken'

const ProfileChangePasswordPage = async () => {
  const accessToken = await getAccessToken()
  const mobile = await getCookieByKey('mobile')

  return (
    <MainLayout>
      <ChangePasswordForm
        mobile={mobile || ''}
        accessToken={accessToken || ''}
      />
    </MainLayout>
  )
}

export default ProfileChangePasswordPage
