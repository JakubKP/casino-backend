import userAvatar from '../images/user.png'
import coinsImage from '../images/coins.png'
import { useSpring, animated } from 'react-spring'

function Number({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 300,
  })
  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
}

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
            <Number n={amount}/>
        </div>
    </div>
  )
}

export default Bet