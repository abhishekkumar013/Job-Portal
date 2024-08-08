import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { clearAllJobError, fetchJobs } from '../store/slices/jobSlice'
import data from '../../public/data/data'
import Spinner from '../components/Spinner'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Jobs = () => {
  const [city, setCity] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [niche, setNiche] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const dispatch = useDispatch()

  const { jobs, loading, error } = useSelector((state) => state.jobs)

  const hanleCityChange = (city) => {
    setCity(city)
    setSelectedCity(city)
  }
  const hanleNicheChange = (niche) => {
    setNiche(niche)
    setSelectedNiche(niche)
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearAllJobError())
    }
    dispatch(fetchJobs(city, niche, searchKeyword))
  }, [dispatch, error, city, niche])

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword))
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>Find Job</button>
            <FaSearch />
          </div>
          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City</h2>
                {data.cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => hanleCityChange(city)}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              <div className="cities">
                <h2>Filter Job By Niche</h2>
                {data.niches.map((niche, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={niche}
                      name="niche"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => hanleNicheChange(niche)}
                    />
                    <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Filter By City</option>
                  {data.cities.map((city, index) => (
                    <option value={city} key={index}>
                      {city}
                    </option>
                  ))}
                </select>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                >
                  <option value="">Filter By Niche</option>
                  {data.niches.map((niche, index) => (
                    <option value={niche} key={index}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>
              <div className="jobs_container">
                {jobs &&
                  jobs.map((element) => {
                    return (
                      <div className="card" key={element._id}>
                        {element.hiringMultipleCandidates === 'Yes' ? (
                          <p className="hiring-multiple">
                            Hiring Multiple Candidates
                          </p>
                        ) : (
                          <p className="hiring">Hiring</p>
                        )}
                        <p className="title">{element.title}</p>
                        <p className="company">{element.companyName}</p>
                        <p className="location">{element.location}</p>
                        <p className="salary">
                          <span>Salary:</span> Rs. {element.salary}
                        </p>
                        <p className="posted">
                          <span>Posted On:</span>{' '}
                          {element.jobPostedOn.substring(0, 10)}
                        </p>
                        <div className="btn-wrapper">
                          <Link
                            className="btn"
                            to={`/post/application/${element._id}`}
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Jobs
