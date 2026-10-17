import { MILLISECOND_UNIT, MILLISECONDS_PER_SECOND } from '@/constants'

export function toMilliseconds(time) {
  const value = parseFloat(time)

  if (time.trim().endsWith(MILLISECOND_UNIT)) return value

  const milliseconds = value * MILLISECONDS_PER_SECOND

  return milliseconds
}
