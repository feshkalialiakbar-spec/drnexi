export const SendSMS = async (
  receptor: string,
  link: string,
  userName: string
) => {
  try {
    const encodedLink = encodeURIComponent(link)
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_KAVENEGAR_URL
      }?receptor=${receptor}&template=Link2Click&token2=${encodedLink}&token=${userName
        .replace(/\s/g, '_')
        .replace(/\u200C/g, '_')}&type=sms`
    )
    await response.json()
  } catch (error) {
    console.error('Kavenegar sendPaymentLink error:', error)
    throw error
  }
}
export const SendSignUpSMS = async (
  receptor: string,
  sender: string,
  senderMobile: string
) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_KAVENEGAR_URL
      }?receptor=${receptor}&template=signupsecretary&token=${sender.replace(
        /\s/g,
        '_'
      )}&token2=${senderMobile}&type=sms`
    )
    await response.json()
  } catch (error) {
    console.error('Kavenegar sendPaymentLink error:', error)
    throw error
  }
}
