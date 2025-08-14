import axios from "axios";
//import dotenv from 'dotenv';
import type {ApiResponse, UserData} from '../types/index'

// userServices fronted 

const API_BASE_URL = 'http://localhost:5001/api';

const notesApi = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // This tell the browser to include Cookies and authorization headers in cross-origin request
})


export const register = async (username:string,email:string,password:string): Promise<UserData | null> => {
    try{
        const response = await notesApi.post<ApiResponse<UserData>>('/register',{username,email,password})
        if (response.data.success) {
            return response.data.data
        }
        return null
    } catch (err:any) {
        throw new Error('Network error or unknown issue to login.');
    }
}

export const login = async (email:string,password:string): Promise<UserData | null> => {
    try {
        const response = await notesApi.post<ApiResponse<UserData | null>>('/login',{email,password})
        if(response.data.success){
        return response.data.data
        }
        return null
    } catch(err){
        return null
    }
    
    
    

}

export const profile = async (): Promise <UserData | null> => {
    try{
        const response = await notesApi.get<ApiResponse<UserData | null>>('/profile')
        if (response.data.data){
            return response.data.data
        }
        throw new Error(response.data.message)
    } catch (err:any) {
        throw new Error('Network error or unknown issue to login.')
    }
}

export const logout = async() : Promise<boolean> => {
    try {
        const response = await notesApi.get<ApiResponse<boolean>>('/logout')
        return response.data.success
    } catch (err:any) {
        throw new Error('Network error or unknown issue to login.')
    }

}