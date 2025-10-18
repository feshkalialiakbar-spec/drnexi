import Link from 'next/link'
import { Suspense } from 'react'
import AuthLayout from '@/layouts/AuthLayout'
import SignupForm from './_components/SignupForm'

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
