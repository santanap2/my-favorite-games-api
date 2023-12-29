export const parseString = (
  cookie?: string,
): { [key: string]: string } | null => {
  if (cookie) {
    const keyValuePairs = cookie.split('&')

    const result: { [key: string]: string } = {}

    keyValuePairs.forEach((keyValue) => {
      const [key, value] = keyValue.split('=')
      result[key] = value
    })

    return result
  }

  return null
}
