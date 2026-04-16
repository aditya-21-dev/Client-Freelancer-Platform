const ProposalCard = ({
  proposal,
  onAccept,
  onReject,
  onMessage,
  showActions = true,
}) => {
  const freelancer = proposal?.freelancer || proposal
  const rating = freelancer?.rating || proposal?.rating || 0
  const bidAmount = proposal?.bidAmount || proposal?.amount || 0
  const deliveryTime = proposal?.deliveryTime || proposal?.estimatedDays || 0

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6">
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {freelancer?.name?.charAt(0).toUpperCase() ||
            proposal?.freelancerName?.charAt(0).toUpperCase() ||
            'F'}
        </div>

        {/* Freelancer Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {freelancer?.name || proposal?.freelancerName || 'Freelancer'}
          </h3>
          {renderStars(rating)}
          {freelancer?.location && (
            <p className="text-sm text-gray-500 mt-1">
              {freelancer.location}
            </p>
          )}
        </div>

        {/* Bid Amount */}
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            ${bidAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Bid Amount</div>
        </div>
      </div>

      {/* Proposal Message */}
      <div className="mb-4">
        <p className="text-gray-700 line-clamp-3">
          {proposal?.message || proposal?.proposalMessage || 'No message provided'}
        </p>
      </div>

      {/* Proposal Details */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Delivery: {deliveryTime} days</span>
          </div>
          {proposal?.status && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                proposal.status === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : proposal.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center space-x-3">
          {onAccept && (
            <button
              onClick={() => onAccept(proposal)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Accept Proposal
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(proposal)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Reject
            </button>
          )}
          {onMessage && (
            <button
              onClick={() => onMessage(proposal)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Message
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProposalCard


