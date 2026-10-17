import {
  DEFAULT_QUERY,
  MATCH_FLAGS,
  REGEXP_ESCAPE_REPLACEMENT,
  REGEXP_SPECIAL_CHARACTERS,
} from '@/constants'

function escapeRegExp(text) {
  return text.replace(REGEXP_SPECIAL_CHARACTERS, REGEXP_ESCAPE_REPLACEMENT)
}

function findMatches(title, query) {
  if (query === DEFAULT_QUERY) return []

  const pattern = new RegExp(escapeRegExp(query), MATCH_FLAGS)

  return [...title.matchAll(pattern)]
}

export function splitByQuery(title, query) {
  const matches = findMatches(title, query.trim())
  const parts = []
  let plainStart = 0

  for (const match of matches) {
    const [text] = match

    const plainText = title.slice(plainStart, match.index)
    if (plainText) parts.push({ start: plainStart, text: plainText, isMatch: false })

    parts.push({ start: match.index, text, isMatch: true })
    plainStart = match.index + text.length
  }

  const lastText = title.slice(plainStart)
  if (lastText) parts.push({ start: plainStart, text: lastText, isMatch: false })

  return parts
}
