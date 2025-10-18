'use server'
import { IUserResponse } from '@/interfaces'
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
  cookies().set('role', `${data.user_role_id}`)
  cookies().set('user_status', data.customer_status)
  cookies().set('role_type', `${data.role_type}`)
  cookies().set('role_count', `${data.role_count}`)
}

export async function setTokenIntoCookie({
  data,
  mobile,
}: {
  data: IAccessTokenResponse
  mobile: string
}) {
  cookies().set('access_token', data.access_token, {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  cookies().set('mobile', mobile)
  cookies().set('lastlogin_date', data.lastlogin_date)
  cookies().set('lastlogin_time', data.lastlogin_time)
}

export async function deleteAllCookies() {
  cookies().delete('access_token')
  cookies().delete('role')
  cookies().delete('lastlogin_date')
  cookies().delete('lastlogin_time')
  cookies().delete('user_status')
  cookies().delete('mobile')
  cookies().delete('deposit-amount')
  cookies().delete('deposit-token')
  cookies().delete('deposit-receipt')
  // cookies().delete("token_type");
  // cookies().delete("last_login_ip");
  // cookies().delete("user_status");
  // cookies().delete("city_level");
  // cookies().delete("customer_code");
  // cookies().delete("approve_status");
}

export async function getAllCookies() {
  return cookies().getAll()
}

export async function getCookieByKey(name: string) {
  return cookies().get(name)?.value
}

interface ITagAndValue {
  key: string
  value: string
}
export async function setCookieByTagAndValue({ key, value }: ITagAndValue) {
  cookies().set(key, value)
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
  cookies().set(key, value, {
    path,
  })
}

export async function deleteCookieByKey(key: string) {
  cookies().delete(key)
}
