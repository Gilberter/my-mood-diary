import { useCallback, useEffect, useMemo, useState } from "react";
import type { JournalEntry, NotePayload } from "../types"; // Import the JournalEntry type
import { buildNotePayload, createNote, deleteNote, getNotes, updateNote } from '../services/noteServices';
import toast from 'react-hot-toast';
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import { getPrediction } from "../services/predictionServices";


const useJournal = () => {
    // State to hold the journal entries
    // This will be an array of JournalEntry objects
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const { openModal } = useModal();
    const {user,isAuthenticated,loading} = useAuth();
    const CURRENT_USER_ID = user?._id || '';

    // Function to add a new journal entry
    // It takes a JournalEntry object as an argument and updates the state
    const addEntry = useCallback((newEntry: JournalEntry) => {
        //setEntries((prevEntries) => [...prevEntries, newEntry]);
        setEntries((prev) => [newEntry, ...prev]); // This line is equivalent to the previous one
        // prev => [newEntry, ...prev] Update the new state when the new state depends on the previous state
        // prev will be the most recent state
        // [...prevEntries, entry] will create a new array with the previous entries and the new entry at the end
        return newEntry; // Return the newly added entry
    },[]);

    const editEntry = useCallback((updatedEntry: JournalEntry) => {
        const entryIndex = entries.findIndex(entry => entry._id === updatedEntry._id);
        if (entryIndex !== -1) {
            const updatedEntries = [...entries];
            updatedEntries[entryIndex] = updatedEntry; // Update the entry at the found index
            setEntries(updatedEntries); // Set the new state with the updated entries
        }
    },[])

    const deleteEntry = useCallback((deleteEntry: JournalEntry) => {
        const entryIndex = entries.findIndex(entry => entry._id === deleteEntry._id);
        if (entryIndex !== -1) {
            const updatedEntries = [...entries];
            updatedEntries.splice(entryIndex, 1); // Remove the entry at the found index
            setEntries(updatedEntries); // Set the new state with the updated entries
        }
    }, [])



    const handleDeleteEntry = useCallback(
        async (deleteOldEntry: JournalEntry) => {
          if (deleteOldEntry._id && deleteOldEntry.userId){
            const message = await deleteNote(deleteOldEntry._id,deleteOldEntry.userId)
            deleteEntry(deleteOldEntry); 
            toast.success(message)
          } else {
            toast.error("There is an error deleting the note, check you internet")  
          }
          
      }
    ,[deleteEntry]) 

    const handleNewEntryClick = () => {
        setSelectedEntry(null); // Reset selected entry for new entry
        openModal("writeEntry"); // Open modal for writing a new entry 
    }

    const handleSaveEntry = useCallback(
    async (entryToSave: JournalEntry) => { 
        let mood = entryToSave.mood
        if(!mood){
            const prediction = await getPrediction(entryToSave.content)
            mood = prediction.class == 1 ? 'Happy':'Sad'
        }
        
        const payload:NotePayload = buildNotePayload(entryToSave, CURRENT_USER_ID, mood) 
        const newNote: JournalEntry = entryToSave._id 
            ? await updateNote(entryToSave._id, payload) 
            : await createNote(payload)
        setSelectedEntry(null); // Reset selected entry after editing or creating
        toast.success(entryToSave._id ? "Note Updated" : "Note created succesfully")
        if (entryToSave._id){
            editEntry(newNote)
        } else {
            addEntry(newNote)
        }
    }, [addEntry, editEntry]
    )

    const handleEditEntry = (editedEntry: JournalEntry) => {
        setSelectedEntry(editedEntry)
        openModal("writeEntry"); // Open modal for editing
        // Call the editEntry function from the custom hook
    }

    useEffect(() => {
        const fetchNotes = async () => {
        // Only attempt to fetch notes if the user is authenticated
        // AND a CURRENT_USER_ID is available.
        // We also check 'loading' to prevent fetching before auth context is ready.
        if (isAuthenticated && CURRENT_USER_ID && !loading) {
            try {
            const fetchedNotes = await getNotes(CURRENT_USER_ID);
            setEntries(fetchedNotes); // Update internal notes state
            // Update useJournal's entries state
            } catch (err: any) {
            toast.error("There is an error loading the notes, press F5")
            // If fetching fails, clear entries to prevent showing stale data
            setEntries([]);
            }
        } else if (!isAuthenticated && !loading) {
            // If not authenticated, clear any existing notes
            setEntries([]);
        }
        };
        fetchNotes();
    }, [isAuthenticated, CURRENT_USER_ID, loading, setEntries]);

    const journalApi = useMemo(() => ({
        entries,
        setEntries,
        addEntry,
        editEntry,
        handleDeleteEntry,
        handleNewEntryClick,
        handleSaveEntry,
        handleEditEntry,
        selectedEntry
    }), [entries, selectedEntry, addEntry, editEntry, handleDeleteEntry, handleSaveEntry]);

    return journalApi;

}

export default useJournal;

// Memoization: Using useCallback prevents recreation of 
// functions on every render, which is important when these functions are passed as props to memoized components.