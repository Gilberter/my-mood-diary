import React, { useEffect, useState } from 'react'
import useJournal  from './hooks/useJournal'; // Import the custom hook for journal entries
import WriteEntry from './components/WriteEntry'; // Import the WriteEntry component 
import EntryCard from './components/EntryCard'; // Import the EntryCard component
import Dashboard from './components/Dashboard';
import CalendarComponent from './components/Calendar'; // Import the CalendarComponent
import type { CreateNotePayload, JournalEntry, UpdateNotePayload } from './types'; // Import the JournalEntry type
import './index.css'
import './App.css'
import { createNote, getNotes, updateNote, deleteNote } from './services/noteServices';
import { set } from 'date-fns';

type View = 'dashboard' | 'entries' | 'calendar' | 'settings';


function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const {entries, setEntries, addEntry, editEntry, deleteEntry} = useJournal(); // Use the custom hook to manage journal entries
  const [showWriteEntry, setShowWriteEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [error,setError] = useState<String | null>(null);
  const [notes,setNotes] = useState<JournalEntry[] | null>(null)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'entries', label: 'Entries' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ]

  const handleNewEntryClick = () => {
    setSelectedEntry(null); // Reset selected entry for new entry
    setShowWriteEntry(true); // Open modal for writing a new entry
  }

  // Core logic for creating and updating a note
  
  const handleSaveEntry = async (entryToSave: JournalEntry) => {
    console.log("Edited", entryToSave)
    const userIdOperation = 'CURRENT_USER_ID'
    setError(null)
    try {
      if (entryToSave._id) {
        const payload: UpdateNotePayload = {
          title: entryToSave.title,
          content: entryToSave.content,
          mood: entryToSave.mood,
          date: entryToSave.date // Ensure ISO string
           // Add the user ID here
        }
        const editedEntry = await updateNote(entryToSave._id,payload,userIdOperation)
        editEntry(editedEntry)
        setSelectedEntry(null); // Reset selected entry after editing
        setShowWriteEntry(false); // Close the WriteEntry modal
        alert(`Update ${entryToSave}`);
     
      } else {
        const payload: CreateNotePayload = {
          title: entryToSave.title,
          content: entryToSave.content,
          mood: entryToSave.mood,
          date: entryToSave.date, // Ensure ISO string
          userId: "CURRENT_USER_ID", // Add the user ID here
        };
        const newNote: JournalEntry = await createNote(payload)
        addEntry(newNote)
        setShowWriteEntry(false); // Close the WriteEntry modal
        alert(`Created ${newNote}`)
        console.log(newNote)
      }
    } catch (err:any) {
        setError(`Error fetching entries: ${err.message}`)
        console.log(error)
      }
  }
  
  const handleDeleteEntry = async (deleteOldEntry: JournalEntry) => {
    setError(null)
    try{
      if (deleteOldEntry._id && deleteOldEntry.userId){
        const deletedNoted = await deleteNote(deleteOldEntry._id,deleteOldEntry.userId)
        deleteEntry(deleteOldEntry);
        alert(deletedNoted)
      }
      
    } catch (err:any) {
      setError(`Error fetching entries: ${err.message}`)

    }
     // Call the deleteEntry function from the custom hook
  }

  const handleEditEntry = (editedEntry: JournalEntry) => {
    setSelectedEntry(editedEntry)
    setShowWriteEntry(true); // Open modal for editing
     // Call the editEntry function from the custom hook
  }


  const CURRENT_USER_ID = 'CURRENT_USER_ID'
  useEffect(()=> {
    const fetchNotes = async () => {
      try{
        const fetchedNotes = await getNotes(CURRENT_USER_ID)
        setNotes(fetchedNotes)
        setEntries(fetchedNotes)
        return fetchedNotes
      } catch (err:any) {
        setError(err.message)
        return null
      }
    }
    fetchNotes()
    
    
  }, [])
  

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard entries={entries} />; // Render the Dashboard component
      case 'entries':
        return (
          <div className="space-y-6">
            {entries.length > 0 ? (
                <div className='flex-col '>
                  <h1 className="text-2xl font-bold text-gray-900">Your Journal Entries</h1>
                  <p className='text-gray-600 mb-4'>{entries.length} Entries</p>
                  {entries.map(entry => (
                    <EntryCard key={entry._id} entry={entry} onEdit={handleEditEntry} onDelete={handleDeleteEntry}/>
                  ))}
                </div>
            ) : (
              <div className='flex-col '>
                <div className='flex mx-auto items-center gap-4 mb-6'>
                  <h1 className="text-2xl font-bold text-gray-900">Your Journal Entries</h1>
                  <p className='text-gray-600'>{entries.length} Entries</p>
                </div>
                <div className='flex-col p-8 items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-center'>
                  <div className='text-4xl mb-4'>✍️</div>
                  <h3 className='text-xl font-bold mb-4'>No entries yet</h3>
                  <p className='text-gray-600 mb-3'>Start writing to see your entries here</p>
                  <button onClick={handleNewEntryClick} className="cursor-pointer">
                    <span className="text-white bg-purple-600 px-4 py-2 rounded-lg">Write Entry</span>
                  </button>
                </div>
              </div>
            )
          }
        </div> 
        )
      case 'calendar':
        return <CalendarComponent entries={entries} />; // Render the CalendarComponent
      case 'settings':
        return <div>Settings View</div>;
      default:
        return <div>Select a view</div>;
    }
  }

  return (
    <div className='min-h-screen  bg-gray-50' >
      {/* Header */}
      <header className='border-b border-gray-200'>
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20 py-8'>
            <div className='flex items-center justify-between h-16 gap-4'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-green-200 rounded-lg flex items-center justify-center'>
                <span className="text-3xl text-white font-bold text-sm">MD</span>
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Mood Diary</h1>
            </div>
            <button onClick={handleNewEntryClick} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>Write Entry</button>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex gap-8'>
          {/* Sidebar */}
          <aside className='w-64 flex-shrink-0'>
            <nav className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
              <div className='space-y-2'>
                { navigationItems.map( (item) => {
                  return (
                    <button
                      
                      key={item.id}
                      onClick={() => setCurrentView(item.id as View)}
                      className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        currentView === item.id
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      >
                      
                      <span className='font-medium'>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className='flex-1 min-w-0'>
            {renderCurrentView()}
          </main>

        </div>
        
      </div>
      {/* Modal New Entry */}
      {showWriteEntry && (
        <div className='w-full fixed inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center z-50'>
          <WriteEntry onSave={handleSaveEntry} onCancel={() => setShowWriteEntry(false)} initialEntry={selectedEntry} />
        </div>
      )}
    </div>
  )
}

export default App;
