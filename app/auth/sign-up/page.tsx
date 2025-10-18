 import { Suspense } from 'react'
import AuthLayout from '@/layouts/AuthLayout'
import SignupForm from '../create-new-user-by-admin-access/_components/SignupForm'

const SignupPage = async () => {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        {/* <SignupForm userRole={userRole || "ASSISTANT"} /> */}
        <SignupForm />
      </Suspense>
    </AuthLayout>
  )
}

export default SignupPage
