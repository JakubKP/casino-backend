import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import betsService from './betsService'

const initialState = {
    bets: [],
    coins: 0,
    redBet: 0,
    blackBet: 0,
    greenBet: 0,
    isSuccessBet: false,
    isLoadingBet: false,
    isErrorBet: false,
    messageBet: '',
}

// Make bet
export const sendBet = createAsyncThunk('bet/sendBet', async (bet, thunkAPI) => {
    try {
        return await betsService.sendBet(bet)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


// Get coins
export const getCoins = createAsyncThunk('bet/getCoins', async (thunkAPI) => {
    try {
        return await betsService.getCoins()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        console.log(message)
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Bets
export const getBets = createAsyncThunk('bet/getBets', async (thunkAPI) => {
    try {
        return await betsService.getBets()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const betSlice = createSlice({
    name: 'bet',
    initialState,
    reducers: {
        resetBets: (state) => {
            state.isLoadingBet = false
            state.isSuccessBet = false
            state.isErrorBet = false
            state.messageBet = ''
        },
        coinsReset: (state) => {
            state.coins = 0
        },
        afterRoundReset: (state) => {
            state.bets = []
            state.redBet = 0
            state.blackBet = 0
            state.greenBet = 0
        },
        addBet: (state, action) => {
            state.bets = [...state.bets, action.payload]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendBet.pending, (state) => {
                state.isLoadingBet = true
            })
            .addCase(sendBet.fulfilled, (state, action) => {
                state.blackBet += Number(action.payload.black)
                state.redBet += Number(action.payload.red)
                state.greenBet += Number(action.payload.green)
                state.messageBet = action.payload.message
                state.isLoadingBet = false
                state.isSuccessBet = true
                state.coins = action.payload.coins
            })
            .addCase(sendBet.rejected, (state, action) => {
                state.isLoadingBet = false
                state.isErrorBet = true
                state.messageBet = action.payload
            })
            .addCase(getCoins.fulfilled, (state, action) => {
                state.blackBet += Number(action.payload.black)
                state.redBet += Number(action.payload.red)
                state.greenBet += Number(action.payload.green)
                state.isLoadingBet = false
                state.coins = action.payload.coins
            })
            .addCase(getBets.fulfilled, (state, action) => {
                state.bets = action.payload
            })
    }
})


export const { resetBets, coinsReset, afterRoundReset, addBet } = betSlice.actions
export default betSlice.reducer