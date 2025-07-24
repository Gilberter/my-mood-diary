import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface DecodedToken {
    id: string;
    email: string;
    username: string;
    iat: number; // "Issued At" - timestamp when the token was issued
    exp: number;  // "Expiration Time" - timestamp when the token expires
}

// This allows TypeScript to understand that 'req.user' might exist on the Request object.
export interface AuthRequest extends Request {
    user?: DecodedToken; // '?' makes it optional, as not all requests will have a user (e.g., public routes)
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    //Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

