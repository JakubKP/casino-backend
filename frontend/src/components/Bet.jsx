import userAvatar from '../images/user.png'
import coinsImage from '../images/coins.png'

function Bet({ userName, amount }) {
  return (
    <div className='user-bet'>
        <div className='user-avatar'>
            <img src={userAvatar} alt='userAvatar' />
        </div>
        <div className='name'>
            {userName}
        </div>
        <div className='bet-amount'>
            <img src={coinsImage} alt='coins' />
            {amount}
        </div>
    </div>
  )
}

export default Bet