'use client'
import { getAccessToken } from '@/hooks/getAccessToken'
import { IUserResponse, UserRoles } from '@/interfaces'
import {
  DeterminationRole,
  GetCurrentUser,
  GetUserPermissions,
  GetUserRoles,
} from '@/services/user'
import { ArrowLeft2 } from 'iconsax-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import LoadingComponent from '../Loading/page'
import {
  setCookieByTagAndValue,
  setCurrentUsertoCookie,
} from '@/actions/cookieToken'

const SelectWallet = ({ autoRedirect }: { autoRedirect: boolean }) => {
  const [roles, setRoles] = useState<UserRoles[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const changeUserRole = async (id: number) => {
    const accessToken = await getAccessToken()
    const result = await DeterminationRole({ id, accessToken })
    await setCurrentUsertoCookie({
      data: (await GetCurrentUser({ accessToken })) as IUserResponse,
    })
    await GetUserPermissions({
      accessToken,
      role_id: id,
    }).then((result) => {
      if (result && result?.length > 0) {
        const value = JSON.stringify(
          result?.reduce(
            (acc, row) => {
              acc[0].push(row.menu_code)
              acc[1].push(row.form_code)
              acc[2].push(row.action_type)
              return acc
            },
            [[], [], []] as [string[], string[], number[]]
          )
        )
        document.cookie = `uzrprm=${encodeURIComponent(
          value
        )}; path=/; max-age=4200; SameSite=Lax`
      }
    })

    if (result && result.status === '1') {
      location.href = '/wallet'
    }
  }

  const fetchRoles = useCallback(async () => {
    const accessToken = await getAccessToken()
    const allRoles = await GetUserRoles({
      accessToken,
    })
    if (allRoles?.length && allRoles?.length < 1 && autoRedirect) {
      location.href = '/wallet'
    }
    if (allRoles) {
      if (allRoles.length === 1 && autoRedirect) {
        location.href = '/wallet'
      } else setRoles(allRoles)
      localStorage.setItem('rolenumber', `${allRoles.length}`)

      setLoading(false)
    }
  }, [setRoles, autoRedirect])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className='flex flex-col  items-center '>
            <p className='mb-6 font-bold'>
              به پروفایل چه کسی می‌خواهید وارد شوید؟
            </p>
            {roles.map((role, index) => (
              <div
                className='w-full flex justify-between bg-[#EDF0F2] my-3 rounded-lg items-center min-h-12 cursor-pointer py-1 px-2'
                key={index}
                onClick={() => {
                  changeUserRole(role.user_role_id)
                }}>
                <div className='flex items-center gap-5 text-[#50545F]'>
                  <Image
                    src={index % 2 === 0 ? '/images/me.svg' : '/images/me.svg'}
                    alt={role.customer_name}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div className='flex flex-col'>
                    <p className={'text-[#2F27CE] font-bold'}>
                      {role.clevel === 0
                        ? 'کیف پول من'
                        : ' کیف پول ' + role?.customer_name}
                    </p>
                    <div className='flex gap-1'>
                      {`مربوط به حساب ${
                        role.clevel === 0 ? 'شما' : role.customer_name
                      }  با امکان `}
                      <p
                        className={`${
                          role.clevel === 0 ? 'bg-[#FEE3E2]' : 'bg-[#DAFEE5]'
                        } ${
                          role.clevel === 0
                            ? 'text-[#D42620]'
                            : 'text-[#0F973D]'
                        } rounded-lg px-2`}>
                        {role.clevel === 0 ? 'برداشت' : 'واریز'}
                      </p>
                    </div>
                  </div>
                </div>
                <ArrowLeft2 color='#2F27CE' />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default SelectWallet
