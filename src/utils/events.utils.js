import { FIRST_CLICK_DETAIL } from '@/constants'

export function isRepeatedClick(event) {
  const isRepeated = event.detail > FIRST_CLICK_DETAIL

  return isRepeated
}
