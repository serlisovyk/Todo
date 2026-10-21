import { useState } from 'react'
import { useTodos } from '@/context'
import { getFilterResultMessage, getFiltersKey } from '@/utils'
import { useFilters } from './use-filters.js'

export function useFilterAnnouncement() {
  const { todos } = useTodos()

  const { filters } = useFilters()

  const [announcement, setAnnouncement] = useState({
    filtersKey: getFiltersKey(filters),
    message: '',
    attempt: 0,
  })

  const filtersKey = getFiltersKey(filters)
  const message = getFilterResultMessage(todos, filters)

  const hasFiltersChanged = announcement.filtersKey !== filtersKey
  if (hasFiltersChanged) {
    const isNewMessage = message !== announcement.message
    const attempt = isNewMessage ? announcement.attempt + 1 : announcement.attempt

    setAnnouncement({ filtersKey, message, attempt })
  }

  return announcement
}
