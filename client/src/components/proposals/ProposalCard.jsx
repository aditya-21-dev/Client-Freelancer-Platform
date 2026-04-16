import { Link } from 'react-router-dom'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  viewed: 'bg-slate-50 text-slate-700 ring-slate-600/20',
  shortlisted: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  rejected: 'bg-red-50 text-red-700 ring-red-600/20',
  withdrawn: 'bg-gray-100 text-gray-600 ring-gray-500/10',
}

const ProposalCard = ({
  proposal,
  project,
  freelancer,
  onEdit,
  onWithdraw,
  onShortlist,
  onAccept,
  onReject,
  context = 'freelancer',
}) => {
  const created = proposal.createdAt ? new Date(proposal.createdAt) : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-0.5">
          {project && (
            <Link
              to={`/jobs/${project._id || project.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600"
            >
              {project.title}
            </Link>
          )}
          {freelancer && (
            <p className="text-sm font-semibold text-gray-900">
              {freelancer.name || 'Freelancer'}
            </p>
          )}
          {created && (
            <p className="text-xs text-gray-500">
              Submitted on {created.toLocaleDateString()}
            </p>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
            statusStyles[proposal.status] || statusStyles.pending
          }`}
        >
          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700">
        <div>
          <span className="text-gray-500">Bid:</span>{' '}
          <span className="font-semibold">${proposal.bidAmount}</span>
        </div>
        <div>
          <span className="text-gray-500">Delivery:</span>{' '}
          <span className="font-semibold">{proposal.deliveryTime} days</span>
        </div>
      </div>

      {proposal.coverLetter && (
        <p className="text-xs text-gray-600 line-clamp-2">{proposal.coverLetter}</p>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <Link
          to={`/proposals/${proposal.id}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View Details →
        </Link>

        <div className="flex flex-wrap gap-2">
          {context === 'freelancer' && (
            <>
              {proposal.status === 'pending' && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(proposal)}
                  className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
              {proposal.status !== 'withdrawn' && onWithdraw && (
                <button
                  type="button"
                  onClick={() => onWithdraw(proposal)}
                  className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100"
                >
                  Withdraw
                </button>
              )}
            </>
          )}

          {context === 'client' && (
            <>
              {onShortlist && proposal.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => onShortlist(proposal)}
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Shortlist
                </button>
              )}
              {onAccept && proposal.status !== 'accepted' && (
                <button
                  type="button"
                  onClick={() => onAccept(proposal)}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  Accept
                </button>
              )}
              {onReject && proposal.status !== 'rejected' && (
                <button
                  type="button"
                  onClick={() => onReject(proposal)}
                  className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100"
                >
                  Reject
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProposalCard

