import { useEffect, useState } from 'react'
import { TOAST_DURATION } from '@/constants'

export function useToastTimer(onDismiss) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPaused = isHovered || isFocused

  useEffect(() => {
    if (isPaused) return

    const timerId = setTimeout(onDismiss, TOAST_DURATION)

    return () => clearTimeout(timerId)
  }, [isPaused, onDismiss])

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => setIsHovered(false)

  const handleFocus = () => setIsFocused(true)

  const handleBlur = () => setIsFocused(false)

  return { handleMouseEnter, handleMouseLeave, handleFocus, handleBlur }
}
