const variantClasses = {
  primary: 'bg-brand-primary text-white',
  subtle: 'bg-brand-messageReceived text-brand-subtext',
  success: 'bg-brand-messageSent text-brand-text',
}

const Badge = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
