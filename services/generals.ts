export const IsHolidayToday = async ({
  accessToken ,
}: {
  accessToken: string | undefined
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/today`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      }
    )
    if (response.status !== 200) return
    const result = await response.json()
    return result.data
  } catch (error: unknown) {
    console.log(error)
  }
}

