import axios from 'axios'
axios.defaults.withCredentials = true;

const API_URL = '/api/bets/'

// Make bet
const sendBet = async (betData) => {
    const response = await axios.post(`http://localhost:5000${API_URL}bet`, betData)

    return response.data
}

// Get coins
const getCoins = async () => {
    const response = await axios.get(`http://localhost:5000${API_URL}getcoins`)

    return response.data
}

// Get Bets
const getBets = async () => {
    const response = await axios.get(`http://localhost:5000${API_URL}getbets`)

    return response.data
}

// Free coins
const freeCoins = async () => {
    const response = await axios.post(`http://localhost:5000${API_URL}freecoins`)

    return response.data
}

const authService = {
    sendBet,
    getCoins,
    getBets,
    freeCoins,
}

export default authService