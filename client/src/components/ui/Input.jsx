const Input = ({
  id,
  name,
  type = 'text',
  label,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
        {...props}
      />
    </div>
  )
}

export default Input
