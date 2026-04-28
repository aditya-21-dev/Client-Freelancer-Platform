import { useEffect, useMemo, useState } from 'react'
import { fetchFreelancerJobs } from '../../services/jobService'
import { uploadSubmission } from '../../api/submissionApi'

const ActiveProjects = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState({})
  const [replyMap, setReplyMap] = useState({})
  const [busyJobId, setBusyJobId] = useState('')

  // 🔹 Load jobs
  useEffect(() => {
    let active = true

    const loadJobs = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchFreelancerJobs()
        if (!active) return

        setJobs(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        console.error('[ActiveProjects.loadJobs] error', err)
        setError(err?.message || 'Failed to load active jobs')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      active = false
    }
  }, [])

  // 🔹 Filter active jobs
  const activeJobs = useMemo(
    () => jobs.filter((job) => job?.submission?.status !== 'completed'),
    [jobs]
  )

  // 🔹 Handle submission
  const handleSubmit = async (jobId, { isRevision = false } = {}) => {
    const file = selectedFiles[jobId]
    const replyText = replyMap[jobId]?.trim() || ''

    if (!file) {
      alert("Please select a file")
      return
    }

    try {
      setBusyJobId(jobId)
      setError('')

      const formData = new FormData()
      formData.append("file", file)
      formData.append("jobId", jobId)
      formData.append("message", isRevision ? replyText : "")

      const token = localStorage.getItem("token")

      if (!token) {
        setError("User not authenticated")
        return
      }

      await uploadSubmission(formData, token)

      console.log('[ActiveProjects] submission success')

      // 🔥 Refresh jobs after submission
      const refreshedJobs = await fetchFreelancerJobs()
      setJobs(Array.isArray(refreshedJobs) ? refreshedJobs : [])

      // reset inputs
      setSelectedFiles((prev) => ({ ...prev, [jobId]: null }))
      setReplyMap((prev) => ({ ...prev, [jobId]: '' }))

    } catch (err) {
      console.error('[ActiveProjects.handleSubmit] error', err)
      setError(err?.response?.data?.message || 'Failed to submit project')
    } finally {
      setBusyJobId('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 text-brand-text">

      {/* Header */}
      <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
        <h1 className="text-2xl font-semibold">Active Projects</h1>
        <p className="text-sm text-brand-subtext">
          Submit your completed work to clients
        </p>
      </div>

      {/* Loading */}
      {loading && <div className="p-4">Loading projects...</div>}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 text-red-500">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && activeJobs.length === 0 && (
        <div className="p-4 text-brand-subtext">No active projects</div>
      )}

      {/* Jobs List */}
      {!loading && !error && activeJobs.length > 0 && (
        <div className="space-y-4">
          {activeJobs.map((job) => {
            const submissionStatus = job?.submission?.status || 'pending'
            const isBusy = busyJobId === job._id

            return (
              <div
                key={job._id}
                className="border border-brand-border rounded-xl p-4 bg-brand-background"
              >
                <h2 className="font-semibold text-lg">{job.title}</h2>

                <p className="text-sm text-brand-subtext">
                  Budget: INR {job.budget}
                </p>

                <p className="text-sm">
                  Status: <strong>{submissionStatus}</strong>
                </p>

                {/* File input */}
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [job._id]: e.target.files[0],
                    }))
                  }
                  className="mt-3"
                />

                {/* Submit button */}
                <button
                  disabled={isBusy}
                  onClick={() =>
                    handleSubmit(job._id, {
                      isRevision: submissionStatus === 'revision',
                    })
                  }
                  className="mt-2 px-4 py-2 bg-brand-primary text-white rounded"
                >
                  {isBusy
                    ? "Submitting..."
                    : submissionStatus === 'revision'
                    ? "Resubmit"
                    : "Submit Project"}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default ActiveProjects