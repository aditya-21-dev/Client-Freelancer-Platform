import { Link } from 'react-router-dom'

const JobCard = ({ job }) => {
  const jobId = job?.id || job?._id

  return (
    <div className="w-full rounded-xl border border-brand-border bg-brand-background p-4 sm:p-5">
      <div className="min-w-0 space-y-2">
        <h3 className="line-clamp-2 break-words text-lg font-semibold text-brand-text">
          {job?.title || 'Job Title'}
        </h3>
        <p className="text-brand-subtext text-sm">Posted {job?.postedTime || 'Recently'}</p>
      </div>

      <p className="mt-4 line-clamp-3 break-words text-sm text-brand-subtext sm:line-clamp-2">
        {job?.fullDescription || job?.description || 'No description available'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(job?.skills || []).slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="max-w-full truncate rounded-xl border border-brand-border bg-brand-background px-3 py-1 text-xs text-brand-subtext"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-brand-text">{job?.budget || 'Budget not specified'}</p>
        <Link
          to={`/job/${jobId}`}
          className="w-full rounded-xl bg-brand-primary px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          View Job
        </Link>
      </div>
    </div>
  )
}

export default JobCard
