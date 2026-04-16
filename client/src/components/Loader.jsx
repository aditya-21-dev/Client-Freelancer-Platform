const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const spinnerSize = sizeClasses[size] || sizeClasses.md

  const Spinner = () => (
    <div className="flex items-center justify-center">
      <div
        className={`${spinnerSize} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      ></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
    </div>
  )
}

export default Loader


