const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password } = req.body
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exist
    const userExist = await User.findOne({ email })

    if(userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        coins: 10000,
    })

    if(user) {
        res.status(201)
            .cookie('token', generateToken(user.id,), { expires: new Date(Date.now() + (30*24*3600000)), httpOnly: true })
            .json(user.name)
            .send()
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(201)
            .cookie('token', generateToken(user.id,), { expires: new Date(Date.now() + (30*24*3600000)), httpOnly: true })
            .json(user.name)
            .send()
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


// @desc    Check if user is already logged
// @route   POST /api/users/islogged
// @access  Public
const isLogged = asyncHandler(async (req, res) => {

    try {
        // Get token from cookies
        const token = req.cookies.token
        if(!token) return res.status(201).send()

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Get user name from token
        const user = await User.findById(decoded.id)
        
        if(user) {
            res.status(201)
            .json(user.name)
            .send()
        }

    } catch (error) {
        console.log(error)
    }
})

// @desc    Log out user
// @route   Get /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('token', "", {
        httpOnly: true,
        expires: new Date(0)
    })
    .send()
})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    isLogged,
    logoutUser,
}