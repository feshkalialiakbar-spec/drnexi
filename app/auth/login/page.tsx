import HandleForms from './_components/HandleForms'
import AuthLayout from '@/layouts/AuthLayout'
import { Suspense } from 'react'

const LoginPage = () => {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <HandleForms />
      </Suspense>
    </AuthLayout>
  )
}

export default LoginPage
