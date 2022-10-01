import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'

function Login({ close }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const { email, password } = formData

  const dispatch = useDispatch()

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if(isSuccess) {
      close()
    }

  }, [isError, isSuccess, isLoading, message, dispatch, close])

  useEffect(() => {
    if(isSuccess || isError) {
      dispatch(reset())
    }
  }, [ isError, isSuccess, dispatch ])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }

  return (
      <div id='login-panel'>
      <button onClick={close} className='close-button'>X</button>
      <form onSubmit={onSubmit} className='login-form'>
          <input 
              type="email" 
              className='form-control' 
              id='email' 
              name='email' 
              value={email} 
              placeholder='Enter your email' 
              onChange={onChange}
              />
            <input 
              type="password" 
              className='form-control' 
              id='password' 
              name='password' 
              value={password} 
              placeholder='Enter password' 
              onChange={onChange}
              />
            <button type='submit' className='submit-login-button'>
                Submit
            </button>
        </form>
      </div>
  )
}

export default Login