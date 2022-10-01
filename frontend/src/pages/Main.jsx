import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Login from '../components/Login'
import Register from '../components/Register'
import RouletteSpinner from '../images/numbers.png'
import Message from '../components/Message'
import coinsImage from '../images/coins.png'
import Bet from '../components/Bet'
import { toast } from 'react-toastify'
import { isLogged, logout } from '../features/auth/authSlice'
import { getBets, getCoins, sendBet, coinsReset, resetBets, afterRoundReset, addBet } from '../features/bets/betsSlice'
import { getMessages, sendMessage, resetMessages, addMessage } from '../features/messages/messagesSlice'
import io from 'socket.io-client'
const socket = io.connect(`http://localhost:${process.env.PORT || 5000}`)

function Main() {
  const [login, setLogin] = useState(false)
  const [register, setRegister] = useState(false)
  const [betValue, setBetValue] = useState(0)
  const [rouletteNumber, setRouletteNumber] = useState('')
  const [timerActive, setTimerActive] = useState('flex')
  const [rollActive, setRollActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()

  const { user, messageAuth, isError } = useSelector((state) => state.auth)
  const { messages, isSuccessMessage, isErrorMessage, messageMessage } = useSelector((state) => state.message)
  const { coins, isSuccessBet, isErrorBet, messageBet, isLoadingBet, redBet, blackBet, greenBet, bets } = useSelector((state) => state.bet)

  const loginClick = () => {
    setLogin(true)
    setRegister(false)
  }

  const registerClick = () => {
    setLogin(false)
    setRegister(true)
  }

  const closeLogin = () => {
    setLogin(false)
  }
  
  const closeRegister = () => {
    setRegister(false)
  }

  const logoutClick = () => {
    dispatch(logout())
    dispatch(coinsReset())
  }

  const makeRedBet = (e) => {
    e.preventDefault()

    dispatch(sendBet({
      betAmount: betValue,
      betType: 'red'
    }))
  }

  const makeGreenBet = (e) => {
    e.preventDefault()

    dispatch(sendBet({
      betAmount: betValue,
      betType: 'green'
    }))
  }

  const makeBlackBet = (e) => {
    e.preventDefault()

    dispatch(sendBet({
      betAmount: betValue,
      betType: 'black'
    }))
  }
  const messageHandler = (e) => {
    setMessage(e.target.value)
  }

  const sendMessageHandler = (e) => {
    e.preventDefault()

    dispatch(sendMessage({
      message,
    }))
  }

  useEffect(() => {
    dispatch(getMessages())
    dispatch(getBets())
  }, [ dispatch ])

  useEffect(() => {
    socket.on('send_draw', (data) => {

      setTimerActive('none')
      setRollActive(true)
      setRouletteNumber(`-${data.position}`)

      setTimeout(() => {
        setRouletteNumber('0')
        if(user !== null && user !== '' && user !== "") {
          dispatch(getCoins())
        }
        dispatch(afterRoundReset())
        setTimerActive('flex')
        setRollActive(false)
        dispatch(getBets())
      }, 6000)
    })

    socket.on('receive_message', (data) => {
      dispatch(addMessage({
        message: data.message,
        userName: data.userName,
        hour: data.hour,
      }))
    })

    socket.on('send_timer', (data) => {
      setTimer(data.timeToSpin)
    })

    socket.on('send_bet', (data) => {
      dispatch(addBet(data))
    })

    return () => {
      socket.off('send_draw');
      socket.off('send_timer');
      socket.off('receive_message');
      socket.off('send_bet');
    };

  }, [ dispatch, user ])

  useEffect(() => {
    if(user !== null && user !== '' && user !== "") {
      dispatch(getCoins())
    }
  }, [ dispatch, user ])

  useEffect(() => {
    if(isErrorBet) {
      toast.error(messageBet)
      dispatch(resetBets())
    }

    if(user === null) {
      dispatch(isLogged())
    }

    if(isSuccessBet) {
      dispatch(resetBets())
    }

    if(isSuccessMessage) {
      dispatch(resetMessages())
    }

    if(isErrorMessage) {
      toast.error(messageMessage)
      dispatch(resetMessages())
    }

    if(isError) {
      toast.error(messageAuth)
    }

  }, [dispatch, user, isSuccessBet, isErrorBet, messageBet, isLoadingBet, isSuccessMessage, isErrorMessage, messageMessage, messageAuth, isError])

  useEffect(() => {
    if(messages.length > 10) {
      document.getElementById('chat-container').scrollTo(0, (messages.length - 10)*80)
    }
  }, [ messages ])

  const rouletteStyles = {
    position: 'relative',
    backgroundImage: `url(${RouletteSpinner})`,
    width: '13800px',
    height: '100%',
    transform: `translateX(${rouletteNumber}px)`,
    transition: '5s',
  }

  const rouletteTimer = {
    display: timerActive,
  }

  const chatMessages = messages.map((message, index) => (
    <Message message={message.message} user={message.userName} hour={message.hour}key={index}/>
  ))

  const redBets = (bets.filter(bet => bet.type === 'red').sort((a,b) => {
    if(a.bet > b.bet) return 1;
    if(a.bet < b.bet) return -1;
    return 0;
}).map((bet, index) => (
    <Bet userName={bet.userName} amount={bet.bet} key={index}/>
  ))).reverse()

  const greenBets = (bets.filter(bet => bet.type === 'green').sort((a,b) => {
    if(a.bet > b.bet) return 1;
    if(a.bet < b.bet) return -1;
    return 0;
}).map((bet, index) => (
    <Bet userName={bet.userName} amount={bet.bet} key={index}/>
  ))).reverse()

  const blackBets = (bets.filter(bet => bet.type === 'black').sort((a,b) => {
    if(a.bet > b.bet) return 1;
    if(a.bet < b.bet) return -1;
    return 0;
}).map((bet, index) => (
    <Bet userName={bet.userName} amount={bet.bet} key={index}/>
  ))).reverse()

  return (
    <>
      <div id='wall' style={login || register ? { display: 'block'} : null}></div>
      <div id='blur' style={login || register ? { filter: 'blur(2px)'} : null}>
      <div className='header'>
        {user ? (
          <>
           <div className='user-name'>
           Your logged as {user}
           </div>
           <div className='user-coins'>
            <img src={coinsImage} alt='coins' className='coins-image-header'/>
            <div>{coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>
          </>
        ) : null}
          <div className='header-buttons'>
          {user ? (
          <button onClick={logoutClick} className='logout'>Logout</button> 
          ) : (
            <>
            <button onClick={loginClick} id='loginButton'>Sign In</button>
            <button onClick={registerClick} id='register-button'>Register</button>
            </>
          )}
          </div>
        </div>
        <div className='chat'>
            <div id='chat-container'>
                {chatMessages}
            </div>
            {user !== null && user !== '' && user !== "" ? (
            <form onSubmit={sendMessageHandler}>
            <input type='text' name='chatMessage' value={message} onChange={messageHandler} placeholder='Say something' maxLength='42'/>
            </form>
            ) : (
              <div className='login-chat'>
                Sign in to chat
              </div>
            )}
        </div>
        <div className='roulette'>
            <div className={rollActive ? 'roulette-container active-roll' : 'roulette-container'}>
                <div className='roulette-timer' style={rouletteTimer}>
                  Rolling in {timer === 0 ? '...' : timer}
                </div>
                <div className='roulette-wheel' style={rouletteStyles} >
                </div>
            </div>
            <div className='roulette-panel'>
              <div className='bet-value-section'>
                <div className='bet-value-input'>
                  <img src={coinsImage} alt='coins' className='coins-image'/>
                  <input id='betValue' type='number' value={betValue} onChange={(e) => setBetValue(e.target.value)}/>
                </div>
                <div className='bet-buttons'>
                  <button className='bet-value-button clear' onClick={() => setBetValue(0)}>CLEAR</button>
                  <button className='bet-value-button' onClick={() => setBetValue(prevState => prevState + 1)}>+1</button>
                  <button className='bet-value-button' onClick={() => setBetValue(prevState => prevState + 10)}>+10</button>
                  <button className='bet-value-button' onClick={() => setBetValue(prevState => prevState + 100)}>+100</button>
                  <button className='bet-value-button' onClick={() => setBetValue(prevState => prevState + 1000)}>+1000</button>
                  <button className='bet-value-button' onClick={() => setBetValue(prevState => Math.floor(prevState/2))}>1/2</button>
                  <button className='bet-value-button' onClick={() => setBetValue(prevState => prevState*2)}>x2</button>
                  <button className='bet-value-button' onClick={() => setBetValue(coins)}>MAX</button>
                </div>
              </div>
              <div className='bet-placing-section'>
                <div className='red-bet'>
                  <button disabled={rollActive ? true : false} onClick={makeRedBet} style={rollActive ? {
                    opacity: '0.4',
                    cursor: 'not-allowed',
                  } : null}>Place Bet</button>
                  <div className='coins-bet-red'>
                      <img src={coinsImage} alt='coins' />
                      <div>{redBet}</div>
                  </div>
                  <div id='red-bets-container'>
                  <div className='red-bets'>
                      {redBets}
                  </div>
                  </div>
                </div>
                <div className='green-bet'>
                  <button disabled={rollActive ? true : false} onClick={makeGreenBet} style={rollActive ? {
                    opacity: '0.4',
                    cursor: 'not-allowed',
                  } : null}>Place Bet</button>
                  <div className='coins-bet-green'>
                    <img src={coinsImage} alt='coins' />
                    <div>{greenBet}</div>
                  </div>
                  <div id='green-bets-container'>
                    <div className='green-bets'>
                      {greenBets}
                    </div>
                  </div>
                </div>
                <div className='black-bet'>
                  <button disabled={rollActive ? true : false} onClick={makeBlackBet} style={rollActive ? {
                    opacity: '0.4',
                    cursor: 'not-allowed',
                  } : null}>Place Bet</button>
                  <div className='coins-bet-black'>
                    <img src={coinsImage} alt='coins' />
                    <div>{blackBet}</div>
                  </div>
                  <div id='black-bets-container'>
                  <div className='black-bets'>
                      {blackBets}
                  </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      {login ? <Login close={closeLogin}/> : null}
      {register ? <Register close={closeRegister}/> : null}
    </>
  )
}

export default Main