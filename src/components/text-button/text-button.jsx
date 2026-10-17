import './text-button.css'

export function TextButton({ children, type = 'button', ...buttonProps }) {
  return (
    <button {...buttonProps} className="text-button" type={type}>
      {children}
    </button>
  )
}
