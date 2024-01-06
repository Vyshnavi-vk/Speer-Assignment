import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import rateLimiter from './middlewares/rateLimiter.js'
import session from 'express-session';


//basic configurations
const app = express()
app.use(express.json())
dotenv.config()
connectDB()



app.use(session({
    secret: 'process.env.JWT_SECRET',
    resave: false,
    saveUninitialized: true,
}));


//request throttler 
const requestThrottler = async (req, res, next) => {
    const throttle_interval = 3000;

    if (!req.session) {
        return res.status(500).json({ message: 'session not found' })
    }

    let lastRequestTime = req.session.lastRequestTime || 0

    const currentTime = new Date().getTime()

    const elapsedTime = currentTime - lastRequestTime

    if (elapsedTime < throttle_interval) {
        const timeToWait = throttle_interval - elapsedTime
        return res.status(429).json({ msg: `Too many requests, please wait for ${timeToWait / 1000} seconds` })
    }

    req.session.lastRequestTime = currentTime

    next()
}


// traffic handling middlewares
app.use(rateLimiter)
app.use(requestThrottler)

//api routes
app.use('/api/auth', userRoutes)
app.use('/api', noteRoutes)


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})

export default app
