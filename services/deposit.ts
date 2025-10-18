import { IDepositForm } from '@/interfaces'

export interface ICreateNewIPG {
  status: '1' | '-1'
  token: string
  payment_amount: number
  payment_url: string
  message?: string
  ref_order_id?: string
}

export const CreateNewIPG = async ({
  data,
  accessToken,
}: {
  data: IDepositForm
  accessToken: string
}): Promise<ICreateNewIPG | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_createipg`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to CreateNewIPG!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

export const SendPaymentLink = async ({ order_id }: { order_id: string }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id }),
      }
    )

    if (response.status !== 200) {
      throw new Error('خطا در ارسال لینک پرداخت')
    }

    const datali = await response.json()
    return datali
  } catch (error) {
    console.log(error)
  }
}
export const CreateVisit = async ({
  pay_id,
  accessToken,
  order_id,
}: {
  pay_id: string
  order_id: string
  accessToken: string
}) => {
  try {
    console.log(pay_id, accessToken)
    const response = await fetch(
      'https://drnexy.com/visit/create',
      // `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_sendipg`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          long_url: pay_id,
          // custom_code: pay_id.split('?')[1],
          order_id,
        }),
      }
    )
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}
// curl -X 'POST' \
//   'https://arya11.ir/visit/create' \
//   -H 'accept: application/json' \
//   -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Nzby5tYXN0ZXIubG9jYWwiLCJzdWIiOiIyNDQiLCJhdWQiOiJtYXN0ZXIiLCJpYXQiOjE3NTkyMzM5NTksIm5iZiI6MTc1OTIzMzk1NCwiZXhwIjoxNzU5MjQ0NzU5LCJqdGkiOiJhNjliYmQ5Ni01YTI5LTRhOWEtOGMzOS1lMzU4YzY0OTllNmYiLCJ0eXBlIjoiYWNjZXNzIiwidXNlcm5hbWUiOiIwOTMzMjM0MzQ2NiIsImVtYWlsIjoiTiIsIm1vYmlsZSI6IjA5MzMyMzQzNDY2Iiwicm9sZXMiOiJQUk9WSURFUiIsImFwcF9pZCI6Im1hc3RlciIsImlwIjoiMTcyLjIzMy4zOC4xMDYiLCJkZXZpY2VfaWQiOm51bGwsInRlbmFudCI6bnVsbCwidGltZXpvbmUiOiJBc2lhL1RlaHJhbiJ9.QSuQXvJMKcaABeLP0zTEpu4HsU6Fi9ylLmkBvrsls8YQxDfzj23oAde5AhyD8VrB72QCRjKa_ZkQgFfzbS5gSJ1tMswNVXUZLwdvviNTD97mZ8gqontKZZNywc3xOGWWaFCdbb06A_D1QwcLXsHFA5VqqOz2pspJEvWak5gu7SUjBK8of6M8I_3xauwfeB0lUfjfzD1pN7aPSMi8XPbhWmdvLNuJHuSRS01mpZl6FYiFZDwIbxuP4HMcJ8tf8HyGp7t9zBaugxDECfcexbkMHxJB5dSioc_zsAZfaGWMiysp86tkKYQQw8iSSjrjsdXmQsDPybEuBjCkLiD4liTGbEMQgbf75cIcb6O0Vh1pSQ_FOIdEDzHrItsI7nMQRXm7TTLPEkMJemdNsHKTtTPl5AEkCxXCBjPejsm1Iq30uAUB1tJlULymhgddicrji3Gw93SQt43pNgenV-KUjth-ZZPSwf7ZvGqW5bt2o7vNAUiY3paLiUzQjbdfYDGaqlopzy0dL97RxNTvLHh96qx10nrUPigZxTRxT90IKqykE3OrolicHtGk2YM7_MgqZgYd6TF0Mfj2DNPr4lzx5QF-JKLb2U8jYDdKQDeWHIyzVWb1ATS_jzYE6Lw8WXSDsE0us831GzAYOR9zdbvGfIZR6NYLi01vnlc_cbnHiSXidDw' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "long_url": "https://arzeshyar.com"
// }
// {
//   "status": 1,
//   "message": "Short link created successfully",
//   "data": {
//     "short_code": "w5sthwES",
//     "short_url": "https://127.0.0.1:5699/r/w5sthwES",
//     "long_url": "https://arzeshyar.com",
//     "id": 2
//   }
// }
