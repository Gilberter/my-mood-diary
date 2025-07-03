import React from 'react';
import { useState } from 'react';
import type { JournalEntry } from '../types'; // Import the JournalEntry type

// Define the props for the EntryCard component 
interface EntryCardProps {
    entry: JournalEntry; // The journal entry object to display
    onEdit: (entry: JournalEntry) => void; // Function to handle editing the entry
    onDelete: (entry: JournalEntry) => void; // Function to handle deleting the entry
}

// EntryCard component to display a single journal entry
// It receives an entry object and functions for editing and deleting the entry

const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onDelete }) => {


    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 space-y-6">
            <h2 className="text-xl font-semibold mb-2">{entry.title} + {entry.id}</h2>
            <p className="text-gray-500 text-sm mb-1">{entry.date}</p>
            <p className={`text-sm mb-3 ${entry.mood === 'happy' ? 'text-green-600' : entry.mood === 'sad' ? 'text-blue-600' : 'text-gray-600'}`}>
                Mood: {entry.mood}
            </p>
            <p className="text-gray-700 mb-4">{entry.content}</p>
            <div className="flex justify-end space-x-2">
                <button onClick={() => onEdit(entry)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(entry)} className="text-red-600 hover:underline">Delete</button>
            </div>
        </div>
    )
}
export default EntryCard;