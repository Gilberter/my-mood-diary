
export interface JournalEntry {
    _id?: string; // Unique identifier for the entry
    title: string; // Title of the journal entry
    date: string; // Date of the entry in 'YYYY-MM-DD' format
    mood: string; // Mood of the entry (e.g., 'happy', 'sad', etc.)
    content: string; // Content of the journal entry
    userId?: string;
}


export interface CreateNotePayload {
  title: string;
  content: string;
  mood: string;
  date: string; // Optional, backend will default to now if not provided
  userId: string; // For now, we'll hardcode or pass this for testing
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  mood?: string;
  date?: string;
  userId: string; // Required for authorization on backend (even if not strictly changed)
  _id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number; // Useful for list responses
  message?: string; // For error messages or success messages
}