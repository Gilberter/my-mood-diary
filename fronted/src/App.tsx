import { useCallback, useEffect, useMemo, useState } from 'react'
import toast, {Toaster} from 'react-hot-toast'

import useJournal  from './hooks/useJournal'; // Import the custom hook for journal entries
import type { JournalEntry } from './types'; // Import the JournalEntry type
import './index.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ModalManager from './components/ModalManager';

import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

// Views Components Imports
import Dashboard from './components/Dashboard';
import CalendarComponent from './components/Calendar'; // Import the CalendarComponent
import EntriesCards from './components/EntriesCards';
import Settings from './components/Settings';

// Imports Services
import { login, logout, register } from './services/userServices';
import { getPrediction } from './services/predictionServices';
import { createNote, getNotes, updateNote, deleteNote, buildNotePayload } from './services/noteServices';

// Imports Context and Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext';
import Header from './components/Header';

type View = 'dashboard' | 'entries' | 'calendar' | 'settings';




function AppContent() {
  const { openModal } = useModal();
  const { loginAuth,isAuthenticated,user,loading,logoutAuth } = useAuth();
  const CURRENT_USER_ID: string = user?._id || ''; // Get the actual user ID
 

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const {entries, setEntries, addEntry, editEntry, deleteEntry} = useJournal(); // Use the custom hook to manage journal entries
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [notes,setNotes] = useState<JournalEntry[] | null>(null) 
  



  const navigationItems: {id:View,label:string}[] = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'entries', label: 'Entries' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ]
  ,[])

  const handleNewEntryClick = () => {
    setSelectedEntry(null); // Reset selected entry for new entry
    openModal("writeEntry"); // Open modal for writing a new entry
  }

  // Core logic for creating and updating a note
  
  const handleSaveEntry = useCallback(
    async (entryToSave: JournalEntry) => { 
      if (entryToSave._id) {
        
        const payload = buildNotePayload(entryToSave,CURRENT_USER_ID)
        const editedEntry = await updateNote(entryToSave._id,payload)
        editEntry(editedEntry)
        setSelectedEntry(null); // Reset selected entry after editing 
        // // Close the WriteEntry modal
        toast.success("Note Updated")
     
      } else {
        
        if (entryToSave.mood == "") {
          const moodPreticted = await getPrediction(entryToSave.content)
          const moodPredictedClass = moodPreticted.class == 1 ? "Happy" : "Sad"
          const payload = buildNotePayload(entryToSave,CURRENT_USER_ID,moodPredictedClass)
          
          const newNote: JournalEntry = await createNote(payload)
          addEntry(newNote)
           // Close the WriteEntry modal
          toast.success("Note created succesfully")
        } else {

          const payload = buildNotePayload(entryToSave,CURRENT_USER_ID)
          const newNote: JournalEntry = await createNote(payload)
          addEntry(newNote)
          // Close the WriteEntry modal
          toast.success("Note created succesfully")
        }
        
      }
  }, [addEntry]
  ) 
  
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
      console.log(isAuthenticated,CURRENT_USER_ID,loading,user)
      if (isAuthenticated && CURRENT_USER_ID && !loading) {
        
        try {
          const fetchedNotes = await getNotes(CURRENT_USER_ID);
          setNotes(fetchedNotes); // Update internal notes state
          setEntries(fetchedNotes); // Update useJournal's entries state
        } catch (err: any) {
          toast.error("There is an error loading the notes, press F5")
          
          // If fetching fails, clear entries to prevent showing stale data
          setNotes([]);
          setEntries([]);
        }
      } else if (!isAuthenticated && !loading) {
        // If not authenticated, clear any existing notes
        setNotes([]);
        setEntries([]);
      }
    };

    fetchNotes();
  }, [isAuthenticated, CURRENT_USER_ID, loading, setEntries]);



  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard entries={entries} />; // Render the Dashboard component
      case 'entries':
        return < EntriesCards entries={entries} handleEditEntry={handleEditEntry} handleDeleteEntry={handleDeleteEntry} handleNewEntryClick={handleNewEntryClick} />
      case 'calendar':
        return <CalendarComponent entries={entries} />; // Render the CalendarComponent
      case 'settings':
        return <Settings />
      default:
        return <div>Select a view</div>;
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading application...</div>;
  }
  

  return (
    <div className='min-h-screen  bg-gray-50' >
      <Toaster
        position="top-center"
        toastOptions={{
          success: { style: { background: "#4ade80", color: "#fff" } },
          error: { style: { background: "#f87171", color: "#fff" } }
        }}
      />
      {/* Header */}
      <Header openModal={openModal} isAuthenticated={isAuthenticated} logoutAuth={logoutAuth}/>

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
            <ErrorBoundary fallback={<div>Oopss! Something went wrong.</div>}>
              {renderCurrentView()}
            </ErrorBoundary>
            
          </main>

        </div>
        
      </div>

      <ModalManager CURRENT_USER_ID={CURRENT_USER_ID} handleSaveEntry={handleSaveEntry} initialEntry={selectedEntry} />

    </div>
    
  )
}

function App() {
    return (
        <Router> {/* Use BrowserRouter for routing */}
            <AuthProvider>
              <ModalProvider>
                <Routes>
                    {/* Public routes */}
                    {/*<Route path="/login" element={<div>Login Page (Implement your LoginForm here)</div>} />*/}
                    {/*<Route path="/register" element={<div>Register Page (Implement your RegisterForm here)</div>} />*/}

                    {/* Private routes */}
                    {/*<Route element={<PrivateRoute />}>*/}
                        <Route path="/*" element={<AppContent />} /> {/* Catch all other routes for authenticated users */}
                    {/*</Route>*/}
                </Routes>
              </ModalProvider>
            </AuthProvider>
        </Router>
    );
}
// const PrivateRoute: React.FC = () => {
//     const { isAuthenticated, loading } = useAuth();

//     if (loading) {
//         return <div>Loading authentication...</div>; // Or a nice spinner
//     }

//     return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };
export default App;
