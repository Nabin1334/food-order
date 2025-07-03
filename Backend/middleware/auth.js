import jwt from 'jsonwebtoken';
// import { User } from '../models/user.js';


const authMiddleware = async (req, res, next) => {
const {token} = req.headers;

    if (!token) {
        return res.json({ success:false,message: ' authorization denied' });
    }

    try {
        const  token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log('Error in authMiddleware:', error);
        
        res.json({ message: 'Token is not valid' });
    }
}

export default authMiddleware;