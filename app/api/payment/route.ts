import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('order_id')
    console.warn(orderId)
    if (orderId) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      )
      const data = await response.json()
      if (data.url) {
        console.log(data)
        return NextResponse.redirect(new URL(data.url, request.url), 302)
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_getreceipt_ipg`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id: orderId }),
          }
        )
        const data = await response.json()
        if (data.url) {
          return NextResponse.redirect(new URL(data.url, request.url), 302)
        }
      }
    }
  } catch (err) {
    console.log(err)
    return NextResponse.redirect(
      new URL(`https://arzeshyar.com/error`),
      // new URL(`https://message-manager.liara.run/#error`),
      302
    )
  }
}

// import { NextResponse, NextRequest } from 'next/server'

// export async function GET(request: NextRequest) {
//   try {
//     const orderId = request.nextUrl.searchParams.get('order_id')
//     if (!orderId) throw new Error('Order ID not provided')

//     const sendRes = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ order_id: orderId }),
//       }
//     )
//     const sendData = await sendRes.json()
//     if (sendData) {
//       console.warn('testestseteststesetestste')
//       console.table(sendData)
//     }
//     const finalUrl = sendData.url || (await getBackupUrl(orderId))

//     if (finalUrl) {
//       return new NextResponse(renderFormHTML(finalUrl), {
//         headers: { 'Content-Type': 'text/html' },
//       })
//     }
//     throw new Error('No redirect URL or token found')
//   } catch (err) {
//     console.error(err)
//     return NextResponse.redirect('https://arzeshyar.com/error', 302)
//   }
// }

// // بک‌آپ گرفتن از ریسیت در صورت عدم وجود لینک اولیه
// async function getBackupUrl(orderId: string) {
//   const receiptRes = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_getreceipt_ipg`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ order_id: orderId }),
//     }
//   )
//   const receiptData = await receiptRes.json()
//   return receiptData.url || null
// }

// // HTML فرم و JS برای سابمیت خودکار
// function renderFormHTML(actionUrl: string) {
//   return `
// <!DOCTYPE html>
// <html lang="fa">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Redirect Page</title>
// </head>
// <body>
//     <form id="paymentForm" action="${actionUrl}">
//         <input type="hidden" name="token" value="token">
//     </form>

//     <script>
//     // Automatically submit the form when the page loads
//     document.addEventListener("DOMContentLoaded", function() {
//         document.getElementById("paymentForm").submit();
//     });
//     </script>
// </body>
// </html>
//   `
// }
// <form id="paymentForm" action="${actionUrl}">
//   <input type="hidden" name="token" value="token" />
// </form>
// <script>
//   document.getElementById("paymentForm").submit();
// </script>
