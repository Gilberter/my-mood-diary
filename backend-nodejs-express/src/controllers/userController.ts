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
    const token = await AuthService.registerUser(username,email,password)
    res.status(200).json({
        success:true,
        data:token
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

    const token = await AuthService.loginUser(email,password)
    res.status(200).json({
        success:true,
        data:token
    })
})

export const profile = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    res.json({ data: req.user });
};