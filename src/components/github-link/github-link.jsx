import { GithubIcon } from '@/components/github-icon'
import { REPOSITORY_LINK_LABEL, REPOSITORY_URL } from '@/constants'
import './github-link.css'

export function GithubLink() {
  return (
    <a
      className="github-link"
      href={REPOSITORY_URL}
      target="_blank"
      rel="noopener noreferrer"
      title={REPOSITORY_LINK_LABEL}
    >
      <GithubIcon className="github-link-icon" />
    </a>
  )
}
