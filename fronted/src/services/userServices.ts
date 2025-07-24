import axios from "axios";
//import dotenv from 'dotenv';
import type {ApiResponse, UserData} from '../types/index'



const API_BASE_URL = 'http://localhost:5001/api';

const notesApi = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})



export const register = async (username:string,email:string,password:string): Promise<UserData> => {
    try{
        const response = await notesApi.post<ApiResponse<UserData>>('/register',{username,email,password})
        if (response.data.data) {
            const user = response.data.data
            return user
        }
        throw new Error(response.data.message)
    } catch (err:any) {
        throw new Error('Network error or unknown issue to login.');
    }
}

export const login = async (email:string,password:string): Promise<UserData> => {
    try{
        const response = await notesApi.post<ApiResponse<UserData>>('/login',{email,password})
        if (response.data.data){
            return response.data.data
        } 
        throw new Error(response.data.message)
    } catch (err:any){
        throw new Error('Network error or unknown issue to login.');
    }
}

export const profile = async (): Promise <UserData> => {
    try{
        const response = await notesApi.get<ApiResponse<UserData>>('/profile')
        if (response.data.data){
            return response.data.data
        }
        throw new Error('Failed to fetch profile: Unexpected API response.')
    } catch (err:any) {
        throw new Error(err)
    }
}

export const logout = async() : Promise<boolean> => {
    try {
        const response = await notesApi.get<ApiResponse<boolean>>('/logout')
        if(response.data.success){
            return true
        }
        return false
    } catch (err:any) {
        throw new Error(err)
    }

}