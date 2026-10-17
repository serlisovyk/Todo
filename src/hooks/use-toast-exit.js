import { useState } from 'react'
import { REDUCED_MOTION_QUERY } from '@/constants'

export function useToastExit(onRemove) {
  const [isLeaving, setIsLeaving] = useState(false)

  const dismiss = () => {
    const isMotionReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
    if (isMotionReduced) {
      onRemove()
      return
    }

    setIsLeaving(true)
  }

  const handleTransitionEnd = (event) => {
    const isOwnTransition = event.target === event.currentTarget

    const isExit = isLeaving && isOwnTransition
    if (!isExit) return

    onRemove()
  }

  return { isLeaving, dismiss, handleTransitionEnd }
}
