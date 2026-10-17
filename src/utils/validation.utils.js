export function isPlainObject(value) {
  const isObject = typeof value === 'object' && value !== null

  return isObject && !Array.isArray(value)
}

export function isIsoDate(value) {
  if (typeof value !== 'string') return false

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return false

  const isCanonical = date.toISOString() === value

  return isCanonical
}
