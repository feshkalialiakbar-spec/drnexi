import { getCookieByKey } from '@/actions/cookieToken'
import { ITransactionQueries } from '@/hooks/useReportsHooks'

export const GetTotalAccount = async ({
  accessToken,
}: {
  accessToken: string | undefined
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_Totalaccount`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
          // authorization: `JWT ${token}`,
        },
        next: {
          revalidate: 3600,
          tags: ['sbw_Totalaccount'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetTotalAccount')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export const GetTotalAccountDetail = async ({
  accessToken,
}: {
  accessToken: string | undefined
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_TotalaccountDetail`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 3600,
          tags: ['sbw_TotalaccountDetail'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetTotalAccountDetail')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export interface IAccountBalanceResponse {
  manager_uid: string
  amount: string
  deposit: string
  withdrawal: string
}

export const GetAccountBalance = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<IAccountBalanceResponse[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_accountbalance`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 3600,
          tags: ['sbw_accountbalance'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetAccountBalance')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}
export interface NoneRemovableBalanceResponse {
  manager_uid: string
  amount: string
}
export const GetNoneRemovableBalance = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<NoneRemovableBalanceResponse[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_Non_removable_balance`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 3600,
          tags: ['sbw_accountbalance'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetAccountBalance')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export interface ITransactionAll {
  pan: string // شماره شبا
  pan_name: string // نام کاربر
  mobile: string // شماره موبایل
  amount?: string // مقدار
  originalAmount?: string // مقدار واقعی
  withdrawal: string // مقدار برداشت
  deposit: string // مقدار واریز
  description: string // توضیحات
  transactionDate_pe: string // تاریخ تراکنش
  transactionTime: string // ساعت تراکنش
  status: number
  status_desc: 'SUCCESS' | 'PENDING' | string // وضعیت تراکنش
  transaction_code: string // کد؟
  transactionType: string // تایپ؟
  transaction_cost: string // کارمز تراکنش
  wage_cost: string // کارمزد؟
  ttype: '1' | '2' // 1 => variz || 2 => bardasht
  ref_id?:string
}

export const GetTransactionAll = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<ITransactionAll[] | undefined> => {
  const role = await getCookieByKey('role')
  const url =
    role === `${process.env.NEXT_PUBLIC_SECRETARY_ROLE}`
      ? `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_transaction_all?ttype=1`
      : `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_transaction_all`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      // next: {
      //   revalidate: 3600,
      //   tags: ['sbw_transaction_all'],
      // },
    })

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetTransactionAll')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

interface IGetTransactionProps {
  accessToken: string | undefined
  queries?: ITransactionQueries
}

export const GetFilteredTransactionAll = async ({
  accessToken,
  queries,
}: IGetTransactionProps): Promise<ITransactionAll[] | undefined> => {
  try {
    let queryString = ''

    if (queries && Object.keys(queries).length > 0) {
      const ttype = queries.ttype && `ttype=${queries.ttype}`
      const amount_max = queries.amount_max
        ? `&amount_max=${queries.amount_max}`
        : ''
      let status = queries.status ? `&tstatus=${queries.status}` : ''
      if (queries.status === 0) {
        status = `&tstatus=0`
      }
      const amount_min = queries.amount_min
        ? `&amount_min=${queries.amount_min}`
        : ''
      const mobile = queries.mobile ? `&mobile=${queries.mobile}` : ''
      const pan = queries.pan ? `&pan=${queries.pan}` : ''
      const payer_name = queries.payer_name
        ? `&payer_name=${queries.payer_name}`
        : ''
      const record_limit = queries.record_limit
        ? `&record_limit=${queries.record_limit}`
        : ''
      const record_skip = queries.record_skip
        ? `&record_skip=${queries.record_skip}`
        : ''
      const transaction_end_date = queries.transaction_end_date
        ? `&transaction_end_date=${queries.transaction_end_date}`
        : ''
      const transaction_start_date = queries.transaction_start_date
        ? `&transaction_start_date=${queries.transaction_start_date}`
        : ''

      queryString = `${ttype}${amount_max}${status}${amount_min}${mobile}${pan}${payer_name}${record_limit}${record_skip}${transaction_end_date}${transaction_start_date}`
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_transaction_all?${queryString}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 3600,
      },
    })
    if (response.status === 429) {
      return []
    }
    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetFilteredTransactionAll')
    }

    const data = await response.json()
   return  Array.isArray(data)? data : []
  } catch (error) {
    console.log(error)
  }
}
