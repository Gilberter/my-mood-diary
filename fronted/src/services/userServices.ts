import axios from "axios";
//import dotenv from 'dotenv';
import type {ApiResponse, UserData} from '../types/index'



const API_BASE_URL = 'http://localhost:5001/api';

const notesApi = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: {
        'Content-Type': 'application/json'
    }
})



const profileApi = (token:string) => {
    return axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
    }
})

}

export const register = async (username:string,email:string,password:string): Promise<string> => {
    try{
        const response = await notesApi.post<ApiResponse<string>>('/register',{username,email,password})
        if (response.data.data) {
            const token = response.data.data
            return token
        }
        throw new Error(response.data.message)
    } catch (err:any) {
        throw new Error('Network error or unknown issue to login.');
    }
}

export const login = async (email:string,password:string): Promise<string> => {
    try{
        const response = await notesApi.post<ApiResponse<string>>('/login',{email,password})
        if (response.data.data){
            const token = response.data.data
            localStorage.setItem('authToken',token) 
            return response.data.data
        } 
        throw new Error(response.data.message)
    } catch (err:any){
        throw new Error('Network error or unknown issue to login.');
    }
}

export const profile = async (token:string): Promise <UserData> => {
    try{
        const response = await profileApi(token).get<ApiResponse<UserData>>('/profile')
        if (response.data.data){
            const user = response.data.data
            localStorage.setItem('authUser',JSON.stringify(user))
            return response.data.data
        }
        throw new Error('Failed to fetch profile: Unexpected API response.')
    } catch (err:any) {
        throw new Error(err)
    }
}