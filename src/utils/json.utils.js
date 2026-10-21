export function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
