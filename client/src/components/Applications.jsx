import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchEmployerApplications,
} from '../store/slices/applicationSlice'
import Spinner from '../components/Spinner'
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaFileAlt,
} from 'react-icons/fa'

const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications,
  )
  const dispatch = useDispatch()
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    dispatch(fetchEmployerApplications())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllApplicationErrors())
    }
    if (message) {
      toast.success(message)
      dispatch(resetApplicationSlice())
      dispatch(fetchEmployerApplications())
    }
  }, [dispatch, error, message])

  const handleDeleteApplication = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      dispatch(deleteApplication(id))
    }
  }

  if (loading) return <Spinner />
  if (applications && applications.length <= 0) {
    return (
      <div className="empty-state">
        <h2>No Applications Yet</h2>
        <p>You haven't received any applications for your job postings yet.</p>
        <Link to="/post-job" className="btn btn-primary">
          Post a New Job
        </Link>
      </div>
    )
  }

  return (
    <div className="my-applications">
      <h2>Applications For Your Posted Jobs</h2>
      <div className="applications-container">
        <div className="applications-list">
          {applications.map((application) => (
            <div
              className={`application-item ${
                selectedApplication === application._id ? 'selected' : ''
              }`}
              key={application._id}
              onClick={() => setSelectedApplication(application._id)}
            >
              <h3>{application.job.title}</h3>
              <p className="applicant-name">{application.jobSeeker.name}</p>
              <p className="application-date">
                <FaCalendarAlt /> Applied on{' '}
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <div className="application-details">
          {selectedApplication &&
            applications.find((app) => app._id === selectedApplication) && (
              <div className="detail-card">
                {(() => {
                  const application = applications.find(
                    (app) => app._id === selectedApplication,
                  )
                  return (
                    <>
                      <h2>{application.job.title}</h2>
                      <div className="job-info">
                        <p>
                          <FaBriefcase /> {application.job.jobType}
                        </p>
                        <p>
                          <FaMapMarkerAlt /> {application.job.location}
                        </p>
                        <p>
                          <FaDollarSign /> {application.job.salary}
                        </p>
                      </div>
                      <div className="applicant-info">
                        <h4>Applicant Details</h4>
                        <p>
                          <strong>Name:</strong> {application.jobSeeker.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {application.jobSeeker.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {application.jobSeeker.phone}
                        </p>
                        <p>
                          <strong>Address:</strong>{' '}
                          {application.jobSeeker.address}
                        </p>
                      </div>
                      <div className="cover-letter">
                        <h4>
                          <FaFileAlt /> Cover Letter
                        </h4>
                        <p>{application.jobSeeker.coverLetter}</p>
                      </div>
                      <div className="action-buttons">
                        <Link
                          to={application.jobSeeker.resume.url}
                          className="btn btn-secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDeleteApplication(application._id)
                          }
                        >
                          Delete Application
                        </button>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Applications
