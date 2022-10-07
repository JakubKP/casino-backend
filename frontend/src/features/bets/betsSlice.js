import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import betsService from './betsService'

const initialState = {
    bets: [],
    betsHistory: [],
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

// Free coins
export const freeCoins = createAsyncThunk('bet/freeCoins', async (data, thunkAPI) => {
    try {
        return await betsService.freeCoins()
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
        },
        redUpdate: (state) => {
            state.redBet = state.redBet * 2
            state.blackBet = 0
            state.greenBet = 0
        },
        greenUpdate: (state) => {
            state.greenBet = state.greenBet * 14
            state.blackBet = 0
            state.redBet = 0
        },
        blackUpdate: (state) => {
            state.blackBet = state.blackBet * 2
            state.greenBet = 0
            state.redBet = 0
        },
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
                state.bets = action.payload.bets
                state.betsHistory = action.payload.betsHistory
            })
            .addCase(freeCoins.fulfilled, (state, action) => {
                state.coins = action.payload.coinsAfterAdd
                state.isSuccessBet = true
                state.messageBet = action.payload.message
            })
            .addCase(freeCoins.rejected, (state, action) => {
                state.isErrorBet = true
                state.messageBet = action.payload
            })
    }
})


export const { resetBets, coinsReset, afterRoundReset, addBet, redUpdate, greenUpdate, blackUpdate } = betSlice.actions
export default betSlice.reducer