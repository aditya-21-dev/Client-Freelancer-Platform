import { Link } from 'react-router-dom'
import Card from './ui/Card'
import Badge from './ui/Badge'

const formatDeadline = (value) => {
  if (!value) return 'No deadline'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'No deadline'
  return parsed.toLocaleDateString()
}

const JobCard = ({ job }) => {
  const jobId = job?.id || job?._id
  const shortDescription = (job?.description || 'No description provided for this job.').slice(0, 140)

  return (
    <Card className="h-full p-5">
      <div className="flex h-full flex-col gap-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-xl font-semibold text-brand-text">{job?.title || 'Untitled Job'}</h3>
          <p className="text-sm text-brand-subtext">Client: {job?.client?.name || 'Anonymous'}</p>
        </div>

        <p className="line-clamp-2 text-sm text-brand-subtext">
          {shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">INR {Number(job?.budget || 0).toLocaleString()}</Badge>
            <Badge variant="subtle">Deadline: {formatDeadline(job?.deadline)}</Badge>
          </div>

          {jobId ? (
            <Link
              to={`/job/${jobId}`}
              className="rounded-2xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              View Job
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export default JobCard
