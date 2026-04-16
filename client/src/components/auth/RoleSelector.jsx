const roles = [
    {
      key: 'client',
      title: 'Client',
      description: 'Post projects and hire skilled freelancers to complete your work.',
    },
    {
      key: 'freelancer',
      title: 'Freelancer',
      description: 'Browse projects, submit proposals, and earn by completing tasks.',
    },
  ]
  
  const RoleSelector = ({ onSelect }) => {
    return (
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          Choose Your Role
        </h1>
  
        <p className="text-center text-gray-600 mt-2">
          Select how you want to use the platform
        </p>
  
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.key}
              onClick={() => onSelect(role.key)}
              className="cursor-pointer border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-500 transition"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {role.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default RoleSelector