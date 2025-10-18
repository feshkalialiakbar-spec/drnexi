'use client'
import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import { getAccessToken } from '@/hooks/getAccessToken'

const ChatWidget = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const fetchTransactions = useCallback(async () => {
    const accessToken = await getAccessToken()
    accessToken && setAuthenticated(true)
  }, [setAuthenticated])
  useEffect(() => {
    window.addEventListener('goftino_ready', () => {
      window.Goftino?.setWidget({
        hasIcon: false,
        counter: '#unread_counter',
      })
      const el = document.getElementById('open_chat')
      if (el) {
        el.addEventListener('click', () => {
          window.Goftino?.open()
        })
      }
    })
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <>
      {authenticated &&
        location.pathname !== '/error' &&
        location.pathname !== '/payment-status/success' &&
        location.pathname !== '/payment-status/failed' &&
        location.pathname !== '/receipt' &&
        location.pathname !== 'wallet/deposit/' && (
          <Script
            id='goftino-widget'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
          !(function () {
            var i = 'wnMHxp',
              // var i = 'i9jvr7',
              a = window,
              d = document
              function g() {
                var g = d.createElement('script'),
                s = 'https://www.goftino.com/widget/' + i,
                l = localStorage.getItem('goftino_' + i)
                ;(g.async = !0), (g.src = l ? s + '?o=' + l : s)
                d.getElementsByTagName('head')[0].appendChild(g)
              }
              'complete' === d.readyState
                ? g()
                : a.attachEvent
                ? a.attachEvent('onload', g)
                : a.addEventListener('load', g, !1)
            })()
          `,
            }}
          />
        )}
    </>
  )
}

export default ChatWidget
