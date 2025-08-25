import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token')
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user // Store user info in request object
        next()
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' })
    }
}

export default authMiddleware