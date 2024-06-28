export const parseCookie = (cookie?: string) => {
  if (cookie) {
    const cookiePairs = cookie.split('; ')

    const result: { [key: string]: string } = {}

    cookiePairs.forEach((pair) => {
      const [key, value] = pair.split('=')
      result[key] = decodeURIComponent(value)
    })

    return result
  }
}
