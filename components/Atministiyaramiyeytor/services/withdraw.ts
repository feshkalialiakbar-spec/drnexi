export const GetCustomers = async ({
  accessToken,
}: {
  accessToken: string
}) => {
  try {
    const response = await fetch(
      `https://ofoghlabs.com/.api/v1/bpmwithdrawal_custlist3/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (response.status === 401) {
      location.reload()
    }
    if (response.status !== 200) return

    const result = await response.json()
    return result.data
  } catch (error) {
    console.log('InsertDetailed error:', error)
  }
}

export const GetCustomerRemain = async ({
  accessToken,
  manageruid,
}: {
  accessToken: string
  manageruid: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/bpmwithdrawal_maxamount/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          manageruid,
        }),
      }
    )

    if (response.status === 401) {
      location.reload()
    }
    if (response.status !== 200) return

    const result = await response.json()
    return result.data
  } catch (error) {
    console.log('InsertDetailed error:', error)
  }
}

export const GetShebaList = async ({
  accessToken,
  manageruid,
}: {
  accessToken: string
  manageruid: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/bpmwithdrawal_shabalist/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          manageruid,
        }),
      }
    )

    if (response.status === 401) {
      location.reload()
    }
    if (response.status !== 200) return

    const result = await response.json()
    return result.data
  } catch (error) {
    console.log('InsertDetailed error:', error)
  }
}

export const SendWithdrawOtp = async ({
  accessToken,
  manageruid,
}: {
  accessToken: string
  manageruid: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_banktransfer_debit_otp/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          manageruid,
        }),
      }
    )

    if (response.status === 401) {
      location.reload()
    }
    if (response.status !== 200) return

    return await response.json()
  } catch (error) {
    console.log('InsertDetailed error:', error)
  }
}

export const CreateWithdrawRequest = async ({
  accessToken,
  manageruid,
  amount,
  app_uid,
  cust_address,
  cust_bbc,
  cust_bid,
  cust_bpc,
  cust_bpn,
  cust_tel,
  cust_tinb,
  cust_tob,
  description,
  otp_code,
  payment_method,
  user_uid,
  withdrawal_address,
  withdrawal_bank,
  withdrawal_name,
}: {
  accessToken: string
  manageruid: string
  otp_code: string
  amount: number
  description: string
  payment_method: number
  withdrawal_bank: string
  withdrawal_address: string
  withdrawal_name: string
  app_uid: string
  user_uid: string
  cust_tinb: string
  cust_tob: number
  cust_address: string
  cust_tel: string
  cust_bid: string
  cust_bpc: string
  cust_bbc: string
  cust_bpn: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_banktransfer_debit/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          manageruid,
          accessToken,
          amount,
          app_uid,
          cust_address,
          cust_bbc,
          cust_bid,
          cust_bpc,
          cust_bpn,
          cust_tel,
          cust_tinb,
          cust_tob,
          description,
          otp_code,
          payment_method,
          user_uid,
          withdrawal_address,
          withdrawal_bank,
          withdrawal_name,
        }),
      }
    )

    if (response.status === 401) {
      location.reload()
    }
    if (response.status !== 200) return

    return await response.json()
  } catch (error) {
    console.log('InsertDetailed error:', error)
  }
}
