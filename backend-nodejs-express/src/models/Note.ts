// Emotion Project/my-mood-diary/backend-nodejs-express/src/models/Note.ts

import {Schema,model, Document} from 'mongoose'

export interface JournalEntry extends Document{ // Unique identifier for the entry
    _id: string,
    title: string; // Title of the journal entry
    date: string; // Date of the entry in 'YYYY-MM-DD' format
    mood: string; // Mood of the entry (e.g., 'happy', 'sad', etc.)
    content: string; // Content of the journal entry
    userId: string;
}

const NoteSchema = new Schema<JournalEntry>({
    title: {
        type: String
    },
    content: {
        type: String
    },
    mood: {
        type: String
    },
    date: {
        type: String
    },
    userId: {
        type: String
    }
} , {
    timestamps: true,
    collection: 'notes'
})

const Note = model<JournalEntry>('Note', NoteSchema)
export default Note;