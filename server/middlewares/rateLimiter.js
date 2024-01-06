import setRateLimit from 'express-rate-limit'

const rateLimiter = setRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, Please try again later',
    headers: true,
})

export default rateLimiter