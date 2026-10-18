import { useEffect, useId, useRef, useState } from 'react'
import { hasPanelChoice } from '@/utils'
import { CLOSE_FILTERS_KEY } from '@/constants'
import { useFilters } from './use-filters.js'

export function useFiltersToolbar() {
  const { filters } = useFilters()

  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const panelId = useId()

  const [isOpen, setIsOpen] = useState(false)

  const hasChoice = hasPanelChoice(filters)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== CLOSE_FILTERS_KEY) return

      const isInsidePanel = panelRef.current.contains(event.target)
      const isOnButton = buttonRef.current === event.target

      const isInsideFilters = isInsidePanel || isOnButton
      if (!isInsideFilters) return

      buttonRef.current.focus()
      setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleToggle = () => setIsOpen(!isOpen)

  return { buttonRef, panelRef, panelId, isOpen, hasChoice, handleToggle }
}
