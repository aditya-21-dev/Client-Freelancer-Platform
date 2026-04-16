const Button = ({
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const variantClass =
    variant === 'primary'
      ? 'bg-brand-primary text-white hover:bg-blue-800 focus:ring-blue-500'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-blue-500'

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
