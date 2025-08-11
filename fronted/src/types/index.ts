
export interface JournalEntry {
    _id?: string; // Unique identifier for the entry
    title: string; // Title of the journal entry
    date: string; // Date of the entry in 'YYYY-MM-DD' format
    mood: string; // Mood of the entry (e.g., 'happy', 'sad', etc.)
    content: string; // Content of the journal entry
    userId?: string;
}


export interface UserData {
  _id?: string;
  id?:string;
  email?:string;
  username?: string;  
}


// This interface can be created and updated
export interface NotePayload {
  title: string;
  content: string;
  mood: string;
  date: string;
  userId: string; 
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number; // Useful for list responses
  message?: string; // For error messages or success messages
}