// 'use client'

// import { useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'

// const RedirectPage = () => {
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const orderId = searchParams.get('order_id')

//     const fetchAndRedirect = async () => {
//       try {
//         if (!orderId) {
//           alert('❌ order_id یافت نشد')
//           window.location.href = 'https://arzeshyar.com/error'
//           return
//         }

//         alert('✅ شروع fetch با order_id: ' + orderId)

//         // مرحله اول: فراخوانی sbw_sendipg
//         let res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ order_id: orderId }),
//           }
//         )

//         let data = await res.json()
//         console.log('✅ پاسخ اولیه:', data.url.split('token=')[1])
//         alert(
//           '🟡 پاسخ اولیه دریافت شد:\n' +
//             JSON.stringify(data.url.split('token=')[1], null, 2)
//         )

//         // اگر url و token نبود، برو سراغ دریافت رسید
//         // if (!data.url) {
//         //   alert('🔄 رفتن سراغ getreceipt_ipg...')

//         //   res = await fetch(
//         //     `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_getreceipt_ipg`,
//         //     {
//         //       method: 'POST',
//         //       headers: { 'Content-Type': 'application/json' },
//         //       body: JSON.stringify({ order_id: orderId }),
//         //     }
//         //   )

//         //   data = await res.json()
//         //   console.log('✅ پاسخ دوم:', data.url.split('token=')[1])
//         //   alert('🟢 پاسخ دوم دریافت شد:\n' + JSON.stringify(data, null, 2))
//         // }

//         if (data.url) {
//           alert('🚀 آماده ارسال به درگاه...')

//           // ساخت فرم دقیقاً مثل HTML شما
//           const form = document.createElement('form')
//           // form.method = 'POST'
//           form.action = data.url
//           form.id = 'paymentForm'

//           const input = document.createElement('input')
//           input.type = 'hidden'
//           input.name = 'token'
//           input.value = data.url.split('token=')[1]
//           form.appendChild(input)

//           document.body.appendChild(form)

//           alert(
//             `📤 ارسال فرم به:\n${data.url}\nبا توکن:\n${
//               data.url.split('token=')[1]
//             }`
//           )

//           form.submit()
//         } else {
//           alert('❌ لینک یا توکن موجود نیست')
//           window.location.href = 'https://arzeshyar.com/error'
//         }
//       } catch (err: any) {
//         console.error('🔥 خطای اصلی:', err)
//         alert('🚨 خطای اصلی: ' + err?.message || err)
//         window.location.href = 'https://arzeshyar.com/error'
//       }
//     }

//     fetchAndRedirect()
//   }, [searchParams])

//   return (
//     <div
//       style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}
//     >
//       در حال انتقال به درگاه بانکی... لطفاً منتظر بمانید.
//     </div>
//   )
// }

// export default RedirectPage

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const PaymentRedirectPage = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const [url, setUrl] = useState('')
  const [token, setToken] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId }),
          }
        )

        const response = await res.json()

        if (response.url) {
          setUrl(response.url)
          setToken(response.token)

          // صبر کن تا DOM آپدیت بشه، بعد submit کن
          setTimeout(() => {
            const form = document.getElementById(
              'paymentForm'
            ) as HTMLFormElement
            if (!form) return

            form.submit()

            const formData = new FormData(form)

            fetch(form.action, {
              method: 'POST',
              headers: {
                referer_host: 'https://arzeshyar.com', // هدر دلخواه
              },
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                console.log('Payment response:', data)
              })
              .catch((err) => {
                console.error('Error:', err)
              })
          }, 100)
        }
      } catch (error) {
        console.error('خطا در ارسال به درگاه:', error)
      }
    }

    fetchData()
  }, [orderId])

  return (
    <div>
      <form id="paymentForm" action={url} method="POST">
        <input
          type="hidden"
          name="token"
          value={token}
          // "FuGMAnvz7FstopVp29oh3w4013wS4IElusTAOt8C59DIDuQTEp802kAHNFNd"
        />
      </form>
      <p>در حال انتقال به درگاه پرداخت...</p>
    </div>
  )
}

export default PaymentRedirectPage

// 'use client'

// import { useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'

// const RedirectPage = () => {
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const orderId = searchParams.get('order_id')

//     const fetchAndRedirect = async () => {
//       try {
//         if (!orderId) {
//           // alert('❌ order_id یافت نشد')
//           window.location.href = 'https://arzeshyar.com/error'
//           return
//         }

//         // alert('✅ شروع fetch با order_id: ' + orderId)

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ order_id: orderId }),
//           }
//         )

//         const data = await res.json()
//         console.log('✅ پاسخ اولیه:', data)

//         if (data && data.url) {
//           const token = data.url.split('token=')[1]

//           if (token) {
//             // alert('🚀 آماده ارسال به درگاه...')

//             // ساخت فرم HTML و ارسال با POST
//             const form = document.createElement('form')
//             form.method = 'POST'
//             form.action = data.url

//             const tokenInput = document.createElement('input')
//             tokenInput.type = 'hidden'
//             tokenInput.name = 'token'
//             tokenInput.value = token

//             form.appendChild(tokenInput)
//             document.body.appendChild(form)
//             form.submit()
//           } else {
//             // alert('❌ توکن موجود نیست')
//             window.location.href = 'https://arzeshyar.com/error'
//           }
//         } else {
//           // alert('❌ لینک یا توکن موجود نیست')
//           window.location.href = 'https://arzeshyar.com/error'
//         }
//       } catch (err: any) {
//         console.error('🔥 خطای اصلی:', err)
//         // alert('🚨 خطای اصلی: ' + err?.message || err)
//         window.location.href = 'https://arzeshyar.com/error'
//       }
//     }

//     fetchAndRedirect()
//   }, [searchParams])

//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}>
//       در حال انتقال به درگاه بانکی... لطفاً منتظر بمانید.
//     </div>
//   )
// }

// export default RedirectPage
