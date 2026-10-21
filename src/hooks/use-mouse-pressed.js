import { useEffect, useRef } from 'react'

export function useMousePressed() {
  const isMousePressedRef = useRef(false)

  useEffect(() => {
    const handleMouseDown = () => {
      isMousePressedRef.current = true
    }

    const handleMouseUp = () => {
      isMousePressedRef.current = false
    }

    document.addEventListener('mousedown', handleMouseDown, { capture: true })
    document.addEventListener('mouseup', handleMouseUp, { capture: true })

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, { capture: true })
      document.removeEventListener('mouseup', handleMouseUp, { capture: true })
    }
  }, [])

  return isMousePressedRef
}
