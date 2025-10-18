export const getCookieByName = (name: string) => {
  const cookieArr = document.cookie.split('; ') // Split cookies by "; "
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=') // Split each cookie into key/value
    if (cookiePair[0] === name) {
      return cookiePair[1] // Return the value if the name matches
    }
  }
  return null
}
