import React from 'react'

function lastBet({ color }) {
  let betColor
  if(color === 'red') {
    betColor = '#D4594C'
  } else if (color === 'green') {
    betColor = '#5DB76E'
  } else if (color === 'black') {
    betColor = '#393939'
  }
  return (
    <div className='last-bet' style={{
      backgroundColor: betColor
      }}>
    </div>
  )
}

export default lastBet