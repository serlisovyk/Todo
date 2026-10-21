import { splitByQuery } from '@/utils'
import './highlighted-text.css'

export function HighlightedText({ text, query }) {
  const parts = splitByQuery(text, query)

  const nodes = parts.map(({ start, text: partText, isMatch }) =>
    isMatch ? (
      <mark key={start} className="highlighted-text-mark">
        {partText}
      </mark>
    ) : (
      partText
    ),
  )

  return <>{nodes}</>
}
