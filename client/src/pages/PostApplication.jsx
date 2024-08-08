import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  clearAllApplicationErrors,
  postApplication,
  resetApplicationSlice,
} from '../store/slices/applicationSlice'

import { toast } from 'react-toastify'
import { fetchSingleJob } from '../store/slices/jobSlice'
import { IoMdCash, IoMdBriefcase, IoMdCalendar } from 'react-icons/io'
import { FaLocationDot, FaBuilding } from 'react-icons/fa6'

const JobDetails = () => {
  const navigate = useNavigate()
  const { singleJob } = useSelector((state) => state.jobs)
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const { loading, error, message } = useSelector((state) => state.applications)

  const { jobId } = useParams()
  const dispatch = useDispatch()

  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    dispatch(fetchSingleJob(jobId))
  }, [dispatch, jobId])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllApplicationErrors())
    }
    if (message) {
      toast.success(message)
      dispatch(resetApplicationSlice())
    }
    if (!isAuthenticated || (user && user.role === 'Employer')) {
      navigate('/')
    }
  }, [dispatch, error, message, isAuthenticated, user])

  const handlePostApplication = () => {
    const id = jobId

    dispatch(postApplication(id))

    // toast.success('Application Posted')
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (!singleJob.title) {
    return <div className="loading">Loading job details...</div>
  }

  return (
    <article className="job-details-page">
      <div className="job-header">
        <h1>{singleJob.title}</h1>
        <div className="job-meta">
          <span>
            <FaBuilding /> {singleJob.company}
          </span>
          <span>
            <FaLocationDot /> {singleJob.location}
          </span>
          <span>
            <IoMdCalendar /> Posted on: {formatDate(singleJob.createdAt)}
          </span>
        </div>
      </div>

      <div className="job-content">
        <section className="job-overview">
          <h2>Job Overview</h2>
          <div className="overview-items">
            <div className="overview-item">
              <IoMdCash />
              <div>
                <h3>Salary</h3>
                <p>{singleJob.salary} per month</p>
              </div>
            </div>
            <div className="overview-item">
              <IoMdBriefcase />
              <div>
                <h3>Job Type</h3>
                <p>{singleJob.jobType}</p>
              </div>
            </div>
            <div className="overview-item">
              <FaLocationDot />
              <div>
                <h3>Location</h3>
                <p>{singleJob.location}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="job-description">
          <h2>Job Description</h2>
          <p>
            {showFullDescription
              ? singleJob.introduction
              : `${singleJob.introduction.slice(0, 300)}...`}
          </p>
          {singleJob.introduction.length > 300 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="read-more"
            >
              {showFullDescription ? 'Read Less' : 'Read More'}
            </button>
          )}
        </section>

        {singleJob.qualifications && (
          <section className="job-qualifications">
            <h2>Qualifications</h2>
            <ul>
              {singleJob.qualifications.split('. ').map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          </section>
        )}

        {singleJob.responsibilities && (
          <section className="job-responsibilities">
            <h2>Responsibilities</h2>
            <ul>
              {singleJob.responsibilities.split('. ').map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </section>
        )}

        {singleJob.offers && (
          <section className="job-benefits">
            <h2>What We Offer</h2>
            <ul>
              {singleJob.offers.split('. ').map((offer, index) => (
                <li key={index}>{offer}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="job-apply">
          <h2>Apply for this position</h2>
          {isAuthenticated && user.role === 'Job Seeker' ? (
            <button
              className="btn apply-btn"
              onClick={handlePostApplication}
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply Now'}
            </button>
          ) : (
            <p>Please log in as a Job Seeker to apply for this position.</p>
          )}
        </section>

        {singleJob.personalWebsite && (
          <section className="company-website">
            <h2>Company Website</h2>
            <Link
              to={singleJob.personalWebsite.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {singleJob.personalWebsite.title}
            </Link>
          </section>
        )}
      </div>
    </article>
  )
}

export default JobDetails
