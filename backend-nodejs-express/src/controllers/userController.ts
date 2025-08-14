import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/authServices';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../errors/ApiError';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendResponse } from '../utils/sendResponse';

// userController backend
export const register = asyncHandler(async (req:Request, res:Response, next:NextFunction) => {
    const {username,email,password} = req.body
    
    if (!username || !email || !password) {
        next(new ApiError('Parameters hasnt been send correctly',400))
    }
    const user = await AuthService.registerUser(username,email,password)

    if(!user){ 
        sendResponse(res,400,user,"User not register successfully",false)
    }

    return sendResponse(res,200,user,"User register successfully",true)
    
})

export const login = asyncHandler( async (req:Request,res:Response, next:NextFunction)=> {
    const {email,password} = req.body
    if  (!email || !password){
        return sendResponse(res,400,null,"Email or password are missing.",false)
    }

    const user = await AuthService.loginUser(email,password)

    if(!user) {
        return sendResponse(res,400,null,"Email or password incorrect.",false)
    }

    res.cookie('token', user.generateJWT(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only over HTTPS
        sameSite:'strict', // CSRF protection
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    return sendResponse(res,200,user,"User logged successfully",true)
})

export const profile = async (req: AuthRequest, res: Response, next:NextFunction) => {
    if (!req.user) return sendResponse(res,400,null,"User nor authenticated successfully",false)

    return sendResponse(res,200,req.user,"User authenticated successfully",true)
};

export const logout = async (req:AuthRequest,res:Response,next:NextFunction) => {
    if (!req.user) return sendResponse(res,400,null,"User cannot be logged out",false)
    
    res.clearCookie('token')
    return sendResponse(res,200,null,"User logged out successfully",true)
}