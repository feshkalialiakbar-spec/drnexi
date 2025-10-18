import HeaderSupport from './HeaderSupport'
import Link from 'next/link'
import Image from 'next/image'
import LogoImage from '@/public/images/logo.jpg'

const Header = () => {
  return (
    <header className='pt-4 pb-6 sm:pb-8 lg:pb-12'>
      <div className='flex items-center flex-wrap'>
        <div className='w-1/5'></div>

        <div className='w-3/5'>
          <div
            onClick={() =>
              (location.href = `/wallet`)
            }
            className='flex justify-center items-center gap-2 cursor-pointer'>
            <Image
              src={LogoImage}
              alt=' دکترنکسی'
              title=' دکترنکسی'
              width={142}
              height={28}
              className='block'
            />
          </div>
        </div>

        <div className='w-1/5'>
          <div className='flex justify-end'>
            <HeaderSupport />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
