const Card = ({ as: Component = 'div', className = '', children, ...props }) => {
  return (
    <Component
      className={`rounded-2xl border border-brand-border bg-brand-background shadow-md ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
