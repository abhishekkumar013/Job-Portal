import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchJobSeekerApplications,
} from '../store/slices/applicationSlice.js'
import Spinner from '../components/Spinner'
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaFileAlt,
} from 'react-icons/fa'

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { loading, error, applications, message } = useSelector(
    (state) => state.applications,
  )
  const dispatch = useDispatch()
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    dispatch(fetchJobSeekerApplications())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllApplicationErrors())
    }
    if (message) {
      toast.success(message)
      dispatch(resetApplicationSlice())
      dispatch(fetchJobSeekerApplications())
    }
  }, [dispatch, error, message])

  const handleDeleteApplication = (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dispatch(deleteApplication(id))
    }
  }

  if (loading) return <Spinner />
  if (applications && applications.length <= 0) {
    return (
      <div className="empty-state">
        <h2>No Applications Yet</h2>
        <p>Your journey to a new career starts with a single application.</p>
        <Link to="/jobs" className="btn btn-primary">
          Explore Job Openings
        </Link>
      </div>
    )
  }

  return (
    <div className="my-applications">
      <h2>My Job Applications</h2>
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
              <p className="company-name">{application.job.companyName}</p>
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
                      <h3>{application.job.companyName}</h3>
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
                        <h4>Your Application Details</h4>
                        <p>
                          <strong>Name:</strong> {application.jobSeeker.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {application.jobSeeker.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {application.jobSeeker.phone}
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
                          Withdraw Application
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

export default MyApplications
