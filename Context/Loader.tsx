'use client'
import { useStates } from '@/Context'
import { getCookieByName } from '@/hooks/getToken'
import { useEffect } from 'react'

const Loader = () => {
  const { setPermissions } = useStates()
  useEffect(() => {
    const getRole = async () => {
      const cookie = getCookieByName('uzrprm')
      if (!cookie) return setPermissions([[], [], []])
      try {
        const parsed = JSON.parse(decodeURIComponent(cookie)) as [
          string[],
          string[],
          number[]
        ]
        const safeParsed: [string[], string[], number[]] = [
          parsed[0] || [],
          parsed[1] || [],
          parsed[2] || [],
        ]

        setPermissions(safeParsed)
      } catch (err) {
        console.error('خطا در پارس کوکی:', err)
        setPermissions([[], [], []])
      }
    }

    getRole()
  }, [])
  return <></>
}

export default Loader
