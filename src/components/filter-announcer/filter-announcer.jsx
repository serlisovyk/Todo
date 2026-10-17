import { useFilterAnnouncement } from '@/hooks'

export function FilterAnnouncer() {
  const { message, attempt } = useFilterAnnouncement()

  return (
    <p className="sr-only" role="status">
      {message && <span key={attempt}>{message}</span>}
    </p>
  )
}
