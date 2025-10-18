import { deleteCookieByKey, IAccessTokenResponse } from '@/actions/cookieToken'
import { IUserResponse } from '../interface'

export interface IAuthenticatedUser {
  access_token: string
  token_type: string
  lastlogin_date: string
  lastlogin_time: string
  last_login_ip: string
  customer_status: string
  user_status: string
  city_level: number
  customer_code: string
  role: string
  approve_status: number
  user_approve_status: number
}

export const UserLoginAPI = async ({
  username,
  password,
}: {
  username: string
  password: string
}): Promise<IAccessTokenResponse | undefined> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      body: new URLSearchParams({
        username: username,
        password: password,
        // scope:'8'0
      }),
    })
    if (!response) return
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const GetOtpWithMobile = async ({ mobile }: { mobile: string }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_getotp/${mobile}`,
      {
        method: 'GET',
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to GetOtpWithMobile!')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

interface IMobileValidatorOtp {
  status: '1' | '-1'
  message: string
}
export const MobileValidatorOtp = async ({
  accessToken,
}: {
  accessToken: string
}): Promise<IMobileValidatorOtp | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_mobile_validator_otp`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to MobileValidatorOtp!')
    }
    if (response.status === 200)
      document.cookie = 'user_status=ACTIVE; path=/auth'

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export const MobileValidatorRequest = async ({
  otp_code,
  accessToken,
}: {
  otp_code: string
  accessToken: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_mobile_validator`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ otp_code }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to MobileValidatorRequest!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

export const LoginWithOtpAndMobile = async ({
  mobile,
  otp,
}: {
  mobile: string
  otp: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/otplogin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp, scopes: '8' }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to LoginWithOtpAndMobile!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

export const GetCurrentUser = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<IUserResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/user/me`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    )
    if ([401, 403].includes(response.status)) {
      await deleteCookieByKey('access_token')
      location.href = '/auth/login'
      return
    }
    if (response.status !== 200) return
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export interface ISignupResponse {
  status: '-1' | '1'
  message: string
}

export const UserChangePassword = async ({
  accessToken,
  newpassword,
  otp_code,
}: {
  accessToken: string
  newpassword: string
  otp_code: string
}): Promise<IMobileValidatorOtp | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_forgot_password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ newpassword, otp_code }),
      }
    )
    if ([401, 403].includes(response.status)) {
      await deleteCookieByKey('access_token')
      location.href = '/auth/login'
      return
    }
    if (response.status !== 200) return
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export const UpdateProfile = async ({
  accessToken,
  Mobile,
  FirstName,
  LastName,
  CompanyName,
  CompanyCode,
  Email,
}: {
  accessToken: string
  Mobile: string
  FirstName?: string
  LastName?: string
  CompanyName?: string
  CompanyCode?: string
  Email?: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/update_profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          Mobile,
          FirstName,
          LastName,
          CompanyName,
          CompanyCode,
          Email,
        }),
      }
    )

    if ([401, 403].includes(response.status)) {
      await deleteCookieByKey('access_token')
      location.href = '/auth/login'
      return
    }
    if (response.status !== 200) return
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}
export const GetUserPermissions = async ({
  accessToken,
  role_id,
}: {
  accessToken: string | undefined
  role_id: string | number
}): Promise<
  | {
      menu_code: string
      menu_type: string
      role_type: number
      form_code: string
      form_status: number
      form_version: number
      action_type: number
    }[]
  | undefined
> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get_permissions?role_id=${role_id}`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if ([401, 403].includes(response.status)) {
      await deleteCookieByKey('access_token')
      location.href = '/auth/login'
      return
    }
    if (response.status !== 200) return
    const result = await response.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}
