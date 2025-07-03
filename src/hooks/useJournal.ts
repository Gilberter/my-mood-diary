import { useState } from "react";
import type { JournalEntry } from "../types"; // Import the JournalEntry type


const useJournal = () => {
    // State to hold the journal entries
    // This will be an array of JournalEntry objects
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    // Function to add a new journal entry
    // It takes a JournalEntry object as an argument and updates the state
    const addEntry = (newEntry: JournalEntry) => {
        //setEntries((prevEntries) => [...prevEntries, newEntry]);
        setEntries((prev) => [newEntry, ...prev]); // This line is equivalent to the previous one
        // prev => [newEntry, ...prev] Update the new state when the new state depends on the previous state
        // prev will be the most recent state
        // [...prevEntries, entry] will create a new array with the previous entries and the new entry at the end
        return newEntry; // Return the newly added entry
    };

    const editEntry = (updatedEntry: JournalEntry) => {
        const entryIndex = entries.findIndex(entry => entry.id === updatedEntry.id);
        if (entryIndex !== -1) {
            const updatedEntries = [...entries];
            updatedEntries[entryIndex] = updatedEntry; // Update the entry at the found index
            setEntries(updatedEntries); // Set the new state with the updated entries
        }
    }

    const deleteEntry = (deleteEntry: JournalEntry) => {
        const entryIndex = entries.findIndex(entry => entry.id === deleteEntry.id);
        if (entryIndex !== -1) {
            const updatedEntries = [...entries];
            updatedEntries.splice(entryIndex, 1); // Remove the entry at the found index
            setEntries(updatedEntries); // Set the new state with the updated entries
        }
    }

    return {
        entries, // Expose the entries state
        addEntry, // Expose the addEntry function
        editEntry, // Expose the editEntry function
        deleteEntry, // Expose the deleteEntry function
    }

}

export default useJournal;