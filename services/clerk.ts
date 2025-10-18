export interface IAssistantList {
  mobile: string
  first_name: string
  last_name: string
  full_name: string
  approve: 0
  status: 'INACTIVE' | 'ACTIVE' | 'DISABLED'
  lastlogin_date_pe: string
  lastlogin_time: string
  user_due_date: string | null
  user_create_date: string | null
}

export const GetAssistantList = async ({
  accessToken,
}: {
  accessToken: string | undefined
}): Promise<IAssistantList[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/assistant_list`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 3600,
          tags: ['assistant_list'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetAssistantList')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

interface IEnableAssistantResponse {
  status: '-1' | '1'
  message: string
}

export const EnableAssistant = async ({
  assistant_id,
  accessToken,
}: {
  assistant_id: string
  accessToken: string | undefined
}): Promise<IEnableAssistantResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/enable_assistant`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ assistant_id }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to EnableAssistant!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}

export const DisableAssistant = async ({
  assistant_id,
  accessToken,
}: {
  assistant_id: string
  accessToken: string | undefined
}): Promise<IEnableAssistantResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/disable_assistant`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ assistant_id }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to DisableAssistant!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}
export const IsAssistantExist = async ({
  accessToken,
  phone,
}: {
  accessToken: string | undefined
  phone: string
}): Promise<IAssistantList | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/assistant_search?assistant_mobile=${phone}`,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 3600,
          tags: ['assistant'],
        },
      }
    )

    if (!response.ok || response.status === 500) {
      throw new Error('Failed to GetAssistantList')
    }

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}
export const SelectAssistant = async ({
  phone,
  nickName,
  accessToken,
}: {
  phone: string
  nickName: string
  accessToken: string | undefined
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/assistant_selection`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          assistant_mobile: phone,
          assistant_name: nickName,
        }),
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to EnableAssistant!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.log(error)
  }
}
