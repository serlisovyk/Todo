import './icon-button.css'

export function IconButton(props) {
  const { Icon, labelText, tone, type = 'button', ...buttonProps } = props

  return (
    <button
      {...buttonProps}
      className="icon-button"
      type={type}
      data-tone={tone}
      title={labelText}
    >
      <Icon className="icon-button-icon" aria-hidden="true" />
    </button>
  )
}
