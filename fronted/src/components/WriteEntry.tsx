import React, { useEffect } from "react";
import type { JournalEntry } from "../types"; // Import the JournalEntry type
import { format } from 'date-fns';


interface WriteEntryProps {
    onSave: (entry: JournalEntry) => void; // Function to handle saving the entry
    onCancel: () => void; // Function to handle canceling the entry
    initialEntry?: JournalEntry | null// Optional initial entry for editing
    CURRENT_USER_ID:string
    
}

const WriteEntry: React.FC<WriteEntryProps> = ({ onSave, onCancel, initialEntry,CURRENT_USER_ID }) => {
    const [title, setTitle] = React.useState("");       
    const [date, setDate] = React.useState("");
    const [mood, setMood] = React.useState("");
    const [content, setContent] = React.useState("");


    // Use useEffect to update form fields if initialEntry changes (e.g., switching from one edit to another)
    // This is important if the modal stays mounted but initialEntry changes

    useEffect(() => {
        if (initialEntry != null) {
        // If an initial entry is provided, populate the form fields with its data
            setTitle(initialEntry.title);
            setDate(initialEntry.date);
            setMood(initialEntry.mood);
            setContent(initialEntry.content);
        } else {
        // If no initial entry is provided, reset the form fields
            setTitle("");
            setDate("");
            setMood("");
            setContent("");
            
        }   
    }, [initialEntry]); // Dependency array to run effect when initialEntry changes
    

    return (
        <form className="w-1/2 max-w-2xl space-y-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900">Write a New Entry</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    value={date ? date : format(new Date(), 'yyyy-MM-dd')} // Default to today's date if no date is set
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Mood</label>
                <input
                    type="text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    rows={4}
                    required
                />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                    Cancel
                </button>
                {(initialEntry == null) ? (
                    <button
                    
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        const newEntry: JournalEntry = {
                            
                            title,
                            date: date ? date : format(new Date(), 'yyyy-MM-dd'), // Default to today's date if no date is set
                            mood,
                            content,
                            userId:CURRENT_USER_ID,
                        };
                        onSave(newEntry);
                        setTitle("");
                        setDate("");
                        setMood("");
                        setContent("");
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
                >
                    Save Entry
                </button>
                ): (
                    <button
                    
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        const newEntry: JournalEntry = {
                            _id: initialEntry._id, // Simple ID generation
                            title,
                            date: date ? date : format(new Date(), 'yyyy-MM-dd'), // Default to today's date if no date is set
                            mood,
                            content,
                            userId: initialEntry.userId
                        };
                        onSave(newEntry);
                        setTitle("");
                        setDate("");
                        setMood("");
                        setContent("");
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
                >
                    Save Edited Entry
                </button>
                )}
                
            </div>
        </form>
    )
}

export default WriteEntry;