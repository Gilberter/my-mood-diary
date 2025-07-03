
export interface JournalEntry {
    id: string; // Unique identifier for the entry
    title: string; // Title of the journal entry
    date: string; // Date of the entry in 'YYYY-MM-DD' format
    mood: string; // Mood of the entry (e.g., 'happy', 'sad', etc.)
    content: string; // Content of the journal entry
}