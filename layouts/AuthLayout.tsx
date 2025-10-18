import Image from 'next/image'
import LogoImage from '@/public/images/logo.jpg'
// import LogoImage from '@/public/images/logo.jpg'
import AuthHeader from '@/components/shared/AuthHeader'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen min-w-[100%]'>
      <AuthHeader />
      <main className='grow pb-24 sm:pb-28'>
        <div className='text-center mb-6 sm:mb-8'>
          <Image
            src={LogoImage}
            alt=' دکترنکسی'
            title=' دکترنکسی'
            width={194}
            height={76}
            className='inline-block mx-auto'
          />
          <h1 className='font-bold text-zinc-800 sm:text-xs mt-3 sm:mt-4'>
             دکترنکسی
          </h1>
        </div>
        <div>{children}</div>
      </main>
    </div>
  )
}

export default AuthLayout
