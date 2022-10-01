import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register({ close }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

  const dispatch = useDispatch()

  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth)

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
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        name,
        email,
        password
      }
      
      dispatch(register(userData))
    }
  }

  return (
    <div id='register-panel'>
      <button onClick={close} className='close-button'>X</button>
      <form onSubmit={onSubmit} className='register-form'>
                        <input 
                            type="text" 
                            className='form-control' 
                            id='name' 
                            name='name' 
                            value={name} 
                            placeholder='Enter your name' 
                            onChange={onChange}
                            />
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
                        <input 
                            type="password" 
                            className='form-control' 
                            id='password2' 
                            name='password2' 
                            value={password2} 
                            placeholder='Confirm password' 
                            onChange={onChange}
                            />
                    <button type='submit' className='submit-register-button'>
                        Submit
                    </button>
            </form>
      </div>

  )
}

export default Register