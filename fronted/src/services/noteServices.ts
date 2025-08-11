import axios from "axios";
//import dotenv from 'dotenv';
import type {JournalEntry, ApiResponse, NotePayload} from '../types/index'



const API_BASE_URL = 'http://localhost:5001/api';

const notesApi = axios.create({
    baseURL: `${API_BASE_URL}/notes`,
    headers: {
        'Content-Type': 'application/json'
    }
})


export const getNotes = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const response = await notesApi.get<ApiResponse<JournalEntry[]>>(`?userId=${userId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch notes.');
  } catch (error: any) {
    // Axios error handling
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error fetching notes.');
    }
    throw new Error('Network error or unknown issue fetching notes.');
  }
};

export const createNote = async (noteData: NotePayload): Promise<JournalEntry> => {
  try {
    const response = await notesApi.post<ApiResponse<JournalEntry>>('/', noteData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create note.');
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error creating note.');
    }
    throw new Error('Network error or unknown issue creating note.');
  }
};

export const updateNote = async (noteId:string, updateData: NotePayload): Promise<JournalEntry> => {
  try{
    // <ApiResponse<JournalEntry>> type of data you expect to recieve
    const response = await notesApi.put<ApiResponse<JournalEntry>>(`/${noteId}`, { ...updateData})
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || 'Failed to update note.');
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error updating note.');
    }
    throw new Error('Network error or unknown issue updating note.');
  }
}

export const deleteNote = async (noteId:string, userId:string):Promise<string> => {
  try {
    const response = await notesApi.delete<ApiResponse<null>>(`/${noteId}`, {params: {userId:userId}})
    if (response.data.success) {
      return "Note deleted successfully"
    }
    throw new Error(response.data.message || 'Failed to delete note: Unknown reason.');
  } catch (error:any) {
    throw new Error('Network error or unknown issue updating note.');
  }
}

export const buildNotePayload = (
  entryData: JournalEntry,
  userId: string,
  moodPrediction?: string
): NotePayload => {
  return {
    title: entryData.title,
    content: entryData.content,
    mood: entryData.mood || moodPrediction || 'Neutral',
    date: entryData.date,
    userId: entryData.userId || userId,
  };
};