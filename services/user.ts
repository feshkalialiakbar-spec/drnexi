import { getCookieByKey, IAccessTokenResponse } from '@/actions/cookieToken'
import { ISignupForm } from '@/app/auth/create-new-user-by-admin-access/_components/SignupForm'
import { IUserResponse, ReferralList, UserRoles } from '@/interfaces'

export interface IAuthenticatedUser {
  access_token: string
  token_type: string
  lastlogin_date: string
  lastlogin_time: string
  last_login_ip: string
  user_status: string
  city_level: number
  customer_code: string
  role: string
  approve_status: number
}

export const UserLoginAPI = async ({
  identifier,
  credential,
}: {
  identifier: string,
  credential: string,
}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login_mmethods`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_method: 'username_password',
        identifier,
        credential,
        subsys_id: 3
      }),
    })

    if (response.status !== 200) {
      throw new Error('Failed to Login!')
    }
    return (await response.json()) as IAccessTokenResponse
  } catch (error) {
    console.error(error)
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
  } catch (error: unknown) {
    console.log(error)
  }
}
interface IMobileValidatorOtp {
  status: '1' | '-1'
  message: string
}
export const RequestOTP = async ({ mobile, otptype, }: {
  mobile: string

  otptype: "verify" | 'login'
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/request-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, subsys_id: 3, otptype })
      }
    )


    if (response.status !== 200) {
      throw new Error('Failed to GetOtpWithMobile!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
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
  } catch (error: unknown) {
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
    // throw new Error(error as any) // error type?
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
      `${process.env.NEXT_PUBLIC_API_URL}/sbw_otplogin`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp, scopes: '3' }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to LoginWithOtpAndMobile!')
    }

    return await response.json()
  } catch (error: unknown) {
    // throw new Error(error as any) // error type?
    console.log(error)
  }
}
export const GetUserRoles = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<UserRoles[] | undefined> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/myroles`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 3600,
        tags: ['user/roles'],
      },
    })

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to Get User Roles')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}

export const DeterminationRole = async ({
  id,
  accessToken,
}: {
  accessToken: string | undefined
  id: number
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/role_determination?p_user_role_id=${id}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to SignupUser!')
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
          'accept': 'application/json',
          authorization: `Bearer ${accessToken}`,
          // authorization: `JWT ${token}`,
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetCurrentUser')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export interface ISignupResponse {
  status: '-1' | '1'
  message: string
}

// export const SignupUser = async ({
//   data,
// }: {
//   data: ISignupForm
// }): Promise<ISignupResponse | undefined> => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sign_up`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       }
//     )

//     if (response.status !== 200) {
//       throw new Error('Failed to SignupUser!')
//     }
//     return await response.json()
//   } catch (error: unknown) {
//     console.log(error)
//   }
// }
export const SignupUser = async ({
  data,
}: {
  data: ISignupForm
}): Promise<ISignupResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to SignupUser!')
    }
    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

interface IChangePassword {
  newpassword: string
  otp_code: string
}

export const UserChangePassword = async ({
  accessToken,
  data,
}: {
  accessToken: string
  data: IChangePassword
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
        body: JSON.stringify(data),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to UserChangePassword!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}
export const callChangePassword = async ({
  newpassword,
}: {
  newpassword: string
}) => {
  const accessToken = await getCookieByKey('access_token')
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/changepassword_fst`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        newpassword,
      }),
    }
  )
  const data = await response.json()
  return data
}

export const GetRefferalList = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<ReferralList[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/my_referals_list`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetCurrentUser')
    }

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
          // authorization: `JWT ${token}`,
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetCurrentUser')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}
