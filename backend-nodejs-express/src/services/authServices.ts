import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../errors/ApiError';

dotenv.config();

export const registerUser = async (username:string, email:string, password:string) => {
    const existingUser = await User.findOne({email})
    if (existingUser) throw new ApiError('User already exists',400)
    
    const user = await User.create({username,email,password})
    return user

}

export const loginUser = async (email:string,password:string) => {
    const user = await User.findOne({email}).select('+password')
    if (!user) throw new ApiError('Invalid email',404)
    const isMatch = await user.comparePassword(password)
    if (!isMatch) throw new ApiError('Invalid Password',404)
    return user
}   
