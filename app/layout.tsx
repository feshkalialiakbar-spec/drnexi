import type { Metadata } from 'next'
import './assets/globals.css'
import ToastProvider from '@/providers/ToastProvider'
import ChatWidget from '@/components/Goftino'
import { StatesProvider } from '@/Context'
import Loader from '@/Context/Loader'

export const metadata: Metadata = {
  // title: ' دکترنکسی',
  // description: 'به اپلیکیشن  دکترنکسی خوش آمدید',

  referrer: 'origin-when-cross-origin',
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="fa" dir="rtl">
      <body
        suppressHydrationWarning={true}
        className="flex flex-col items-center"
      >
        <StatesProvider>
          <Loader />
          <ToastProvider />
          <div className="max-w-[880px] w-full px-4">{children}</div>
          <ChatWidget />
        </StatesProvider>
      </body>
    </html>
  )
}

export default RootLayout
