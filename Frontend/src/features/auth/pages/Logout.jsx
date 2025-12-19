import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../authSlice'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    alert('Logged Out')
    navigate('/')
  }

  return (
    <div>
      <button onClick={handleLogout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}

export default Logout
