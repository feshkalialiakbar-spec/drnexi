import MainLayout from '@/layouts/MainLayout'
import AddClerkForm from '../../../components/Clerk/AddClerkForm'
import { getAccessToken } from '@/hooks/getAccessToken'

const AddClerkPage = async () => {
  const accessToken = await getAccessToken()

  return (
    <MainLayout>
      <AddClerkForm accessToken={accessToken || ''} />
    </MainLayout>
  )
}

export default AddClerkPage
