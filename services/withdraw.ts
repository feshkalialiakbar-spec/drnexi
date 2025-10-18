import { IAddShabaSchema } from '@/interfaces'

export interface IShabaDestinationList {
  sid: string | null
  sdcode: string
  sdtitle: string
  mobile: string
  shaba: string
  bank_code: string
  bank_name: string
  bid_code: string
  fullname: string
}

export const GetShabaDestinationList = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<IShabaDestinationList[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/user/shaba_destination_list`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          // authorization: `JWT ${token}`,
        },
        next: {
          revalidate: 3600,
          tags: ['shaba_destination_list'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetShabaDestinationList')
    }
    const result = await response.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}
export const GetDisableShabaList = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<IShabaDestinationList[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/user/shaba_disabled_list`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          // authorization: `JWT ${token}`,
        },
        next: {
          revalidate: 3600,
          tags: ['shaba_destination_list'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetShabaDestinationList')
    }
    const result = await response.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}
export interface ICreateShabaResponse {
  status: '-1' | '1'
  message: string
  fullname: string
  uid: string
}

export const CreateShabaDestination = async ({
  data,
  accessToken,
}: {
  data: IAddShabaSchema
  accessToken: string
}): Promise<ICreateShabaResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/create_shaba_destination`,
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
      throw new Error('Failed to CreateShabaDestination!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

interface IGetWithdrawalOrderOtp {
  status: '1' | '-1'
  message: string
}
export const DeleteShebaDestination = async ({
  id,
  accessToken,
}: {
  id: string
  accessToken: string 
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/delete_shaba_destination`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ shabad_id: id }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to delete ShabaDestination!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}
export const EnableShebaDestination = async ({
  id,
  accessToken,
}: {
  id: string
  accessToken: string 
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/enable_shaba_destination`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ shabad_id: id }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to delete ShabaDestination!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

export const GetWithdrawalOrderOtp = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<IGetWithdrawalOrderOtp | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_withdrawal_order_otp`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          // authorization: `JWT ${token}`,
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetShabaDestinationList')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export interface IWithdrawalOrderRequest {
  amount: number
  date: string
  message: string
  s_name: string
  s_wallet: string
  status: '1' | '-1'
  time: string
  tracking_number: string
  withdrawal_address: string
  withdrawal_name: string
  originalAmount: string
}

interface IWithdrawSchema {
  target_id: string
  amount: number
  otp_code: string
  description?: string
  Signature: string
}

export const WithdrawalOrderRequest = async ({
  data,
  accessToken,
}: {
  data: IWithdrawSchema
  accessToken: string
}): Promise<IWithdrawalOrderRequest | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_Withdrawal_order`,
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
      throw new Error('Failed to CreateShabaDestination!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}
