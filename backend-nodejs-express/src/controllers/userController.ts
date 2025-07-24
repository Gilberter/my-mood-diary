import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/authServices';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../errors/ApiError';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
    const {username,email,password} = req.body
    
    if (!username || !email || !password) {
        next(new ApiError('Parameters hasnt been send correctly',400))
    }
    const user = await AuthService.registerUser(username,email,password)

    
    res.status(200).json({
        success:true,
        data:user
    })
    
})

export const login = asyncHandler( async (req:Request,res:Response, next:NextFunction)=> {
    const {email,password} = req.body
    if  (!email || !password){
        res.status(400).json({
            success:true,
            data:null
        })
        next(new ApiError('Incorrect password or Email',404))
    }

    const user = await AuthService.loginUser(email,password)

    res.cookie('token', user.generateJWT(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only over HTTPS
        sameSite:'strict', // CSRF protection
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
        success:true,
        data:user
    })
})

export const profile = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    res.json({ data: req.user });
};

export const logout = async (req:AuthRequest,res:Response) => {
    if (!req.user) return res.status(401).json({success:false, message:"Can not logout"})
    
    res.clearCookie('token')
    res.status(200).json({
        success:true,
        message:"Logout successfully"
    })
}