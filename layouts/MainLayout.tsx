'use client'
import Header from '@/components/shared/Header'
import NavigationLinks from '@/components/shared/NavigationLinks'
import Loader from '@/Context/Loader'
import { useEffect, useState } from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [showNav, setShowNav] = useState<boolean>(true)
  useEffect(() => {
    setShowNav(
      ![
        /\/wallet\/withdraw$/,
        /\/wallet\/deposit$/,
        /\/wallet\/all$/,
        /receipt$/,
        /\/profile\/change-password$/,
        /\/clerk\/add$/,
      ].some((path) => path.test(window.location.pathname))
    )
    const handleHashChange = () => {
      location.hash.substring(1) === 'nvdwavshoh'
        ? setShowNav(false)
        : location.hash.substring(1) === 'dwavsh' && setShowNav(true)
    }
    window.addEventListener('hashchange', handleHashChange, false)
    handleHashChange()
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false)
    }
  }, [])
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <Loader />
      <main className='grow mb-20 pb-2'>{children}</main>
      {showNav && <NavigationLinks />}
    </div>
  )
}

export default MainLayout
