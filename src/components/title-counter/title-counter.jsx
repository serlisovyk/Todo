import { getTitleCounterMessage, getTitleCounterText } from '@/utils'
import './title-counter.css'

export function TitleCounter({ id, length }) {
  const counterText = getTitleCounterText(length)
  const message = getTitleCounterMessage(length)

  return (
    <>
      <p id={id} className="title-counter">
        {counterText}
      </p>

      <p className="sr-only" role="status">
        {message}
      </p>
    </>
  )
}
