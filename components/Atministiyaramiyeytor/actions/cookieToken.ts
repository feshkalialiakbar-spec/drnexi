'use server'

import { IUserResponse } from '../interface'
import { cookies } from 'next/headers'

export interface IAccessTokenResponse {
  access_token: string
  token_type: string
  lastlogin_date: string
  lastlogin_time: string
  last_login_ip: string
  role_id: number
}

export async function setCurrentUsertoCookie({
  data,
}: {
  data: IUserResponse
}) {
  ;(await cookies()).set('role', `${data.role}`)
  ;(await cookies()).set('mobile', data.mobile)
  ;(await cookies()).set('user_status', data.customer_status)
}

export async function setTokenIntoCookie({
  data,
  mobile,
}: {
  data: IAccessTokenResponse
  mobile: string
}) {
  ;(await cookies()).set('access_token', data.access_token, {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  ;(await cookies()).set('mobile', mobile)
  ;(await cookies()).set('lastlogin_date', data.lastlogin_date)
  ;(await cookies()).set('lastlogin_time', data.lastlogin_time)
}

export async function deleteAllCookies() {
  ;(await cookies()).delete('access_token')
  ;(await cookies()).delete('role')
  ;(await cookies()).delete('lastlogin_date')
  ;(await cookies()).delete('lastlogin_time')
  ;(await cookies()).delete('user_status')
  ;(await cookies()).delete('mobile')
  ;(await cookies()).delete('deposit-amount')
  ;(await cookies()).delete('deposit-token')
  ;(await cookies()).delete('deposit-receipt')
}

export async function getAllCookies() {
  return (await cookies()).getAll()
}

export async function getCookieByKey(name: string) {
  return (await cookies()).get(name)?.value
}

interface ITagAndValue {
  key: string
  value: string
}
export async function setCookieByTagAndValue({ key, value }: ITagAndValue) {
  ;(await cookies()).set(key, value)
}
export async function setCookieByTagAndValueAndPath({
  key,
  value,
  path,
}: {
  key: string
  value: string
  path: string
}) {
  ;(await cookies()).set(key, value, {
    path,
  })
}

export async function deleteCookieByKey(key: string) {
  ;(await cookies()).delete(key)
}
