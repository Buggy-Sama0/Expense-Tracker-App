import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET; // In production, use an environment variable

export const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};
