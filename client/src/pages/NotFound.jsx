import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearAllUserErrors, register } from '../store/slices/userSlice'
import { toast } from 'react-toastify'
import { FaAddressBook, FaPencilAlt, FaRegUser } from 'react-icons/fa'
import { FaPhoneFlip } from 'react-icons/fa6'
import { MdCategory, MdOutlineMailOutline } from 'react-icons/md'
import { RiLock2Fill } from 'react-icons/ri'

const NotFound = () => {
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [firstNiche, setFirstNiche] = useState('')
  const [secondNiche, setSecondNiche] = useState('')
  const [thirdNiche, setThirdNiche] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState('')
  const nichesArray = [
    'Software Development',
    'Web Development',
    'Cybersecurity',
    'Data Science',
    'Artificial Intelligence',
    'Cloud Computing',
    'DevOps',
    'Mobile App Development',
    'Blockchain',
    'Database Administration',
    'Network Administration',
    'UI/UX Design',
    'Game Development',
    'IoT (Internet of Things)',
    'Big Data',
    'Machine Learning',
    'IT Project Management',
    'IT Support and Helpdesk',
    'Systems Administration',
    'IT Consulting',
  ]
  const resumeHandler = (e) => {
    const file = e.target.files[0]
    setResume(file)
  }
  // const { loading, isAuthenticated, error, message } = useSelector(
  //   (state) => state.user,
  // )
  return (
    <section className="notfound">
      <div className="content">
        <h1>404 Not Found</h1>
        <p>Your Visited Page Not Found. You may go home page.</p>
        <Link to={'/'} className="btn">
          Back to home page
        </Link>
      </div>
    </section>
  )
}

export default NotFound
