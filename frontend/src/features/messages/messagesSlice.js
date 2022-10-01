import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import messagesService from './messagesService'

const initialState = {
    messages: [],
    isSuccessMessage: false,
    isErrorMessage: false,
    isLoadingMessage: false,
    messageMessage: '',
}

// Send message
export const sendMessage = createAsyncThunk('message/sendMessage', async (messageData, thunkAPI) => {
    try {
        return await messagesService.sendMessage(messageData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        console.log(error)
        return thunkAPI.rejectWithValue(message)
    }
})

// Get messages
export const getMessages = createAsyncThunk('message/getMessages', async (thunkAPI) => {
    try {
        return await messagesService.getMessages()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        resetMessages: (state) => {
            state.isSuccessMessage = false
            state.isErrorMessage = false
            state.isLoadingMessage = false
            state.messageMessage = ''
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload]
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.isLoadingMessage = true
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messageMessage = action.payload.message
                state.isLoadingMessage = false
                state.isSuccessMessage = true
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoadingMessage = false
                state.isErrorMessage = true
                state.messageMessage = action.payload
            })
            .addCase(getMessages.pending, (state) => {
                state.isLoadingMessage = true
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoadingMessage = false
                state.messages = action.payload.lastMessages
            })
    }
})



export const { resetMessages, addMessage } = messageSlice.actions
export default messageSlice.reducer