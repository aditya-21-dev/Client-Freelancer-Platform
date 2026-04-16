import ProposalCard from './ProposalCard'

const ProposalList = ({ proposals, getProjectById, getFreelancerById, context, ...handlers }) => {
  if (!proposals || proposals.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
        <h2 className="text-sm font-medium text-gray-900 mb-1">No proposals found</h2>
        <p className="text-xs text-gray-600">You don&apos;t have any proposals here yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          project={getProjectById ? getProjectById(proposal.projectId) : undefined}
          freelancer={getFreelancerById ? getFreelancerById(proposal.freelancerId) : undefined}
          context={context}
          {...handlers}
        />
      ))}
    </div>
  )
}

export default ProposalList

