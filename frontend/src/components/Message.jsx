import React from 'react'
import image from '../images/user.png'

function Message({ message, user, hour }) {

  return (
    <div className='message-container'>
      <div className='avatar'>
        <img src={image} alt='avatar' />
      </div>
      <div className='message'>
        <div className='user-nickname'>
          <div className='nickname'>
            {user}
          </div>
          <div className='hour'> 
          {hour}
          </div>
        </div>
        <div className='msg'>
          {message}
        </div>
      </div>
    </div>
  )
}

export default Message