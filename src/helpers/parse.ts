export const parseCookie = (cookie?: string) => {
  if (cookie) {
    const keyValuePairs = cookie.split('&')

    const result: { [key: string]: string } = {}

    keyValuePairs.forEach((keyValue) => {
      const [key, value] = keyValue.split('=')
      result[key] = value
    })

    return result
  }
}
