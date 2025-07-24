import React, { useEffect, useState } from 'react'
import useJournal  from './hooks/useJournal'; // Import the custom hook for journal entries
import WriteEntry from './components/WriteEntry'; // Import the WriteEntry component 
import EntryCard from './components/EntryCard'; // Import the EntryCard component
import Dashboard from './components/Dashboard';
import CalendarComponent from './components/Calendar'; // Import the CalendarComponent
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import type { CreateNotePayload, JournalEntry, UpdateNotePayload, UserData } from './types'; // Import the JournalEntry type
import './index.css'
import './App.css'
import { createNote, getNotes, updateNote, deleteNote } from './services/noteServices';
import { login,profile, register } from './services/userServices';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

type View = 'dashboard' | 'entries' | 'calendar' | 'settings';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>; // Or a nice spinner
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


function AppContent() {

  const { loginAuth,logout,isAuthenticated,user,loading } = useAuth();
  const CURRENT_USER_ID: string = user?.id || ''; // Get the actual user ID
 

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const {entries, setEntries, addEntry, editEntry, deleteEntry} = useJournal(); // Use the custom hook to manage journal entries
  const [showWriteEntry, setShowWriteEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [error,setError] = useState<String | null>(null);
  const [notes,setNotes] = useState<JournalEntry[] | null>(null) 
  const [modalLogin, setModalLogin] = useState<boolean>(false)
  const [modalRegister, setModalRegister] = useState<boolean>(false)
  const [modalRegisterLogin, setModalRegisterLogin] = useState<boolean>(false)
  const [errorLogin, setErrorLogin] = useState(false)
  


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
        const editedEntry = await updateNote(entryToSave._id,payload,CURRENT_USER_ID)
        editEntry(editedEntry)
        setSelectedEntry(null); // Reset selected entry after editing
        setShowWriteEntry(false); // Close the WriteEntry modal
        alert(`Updated `);
     
      } else {
        const payload: CreateNotePayload = {
          title: entryToSave.title,
          content: entryToSave.content,
          mood: entryToSave.mood,
          date: entryToSave.date, // Ensure ISO string
          userId: CURRENT_USER_ID, // Add the user ID here
        };
        const newNote: JournalEntry = await createNote(payload)
        addEntry(newNote)
        setShowWriteEntry(false); // Close the WriteEntry modal
        alert(`Created `)
      }
    } catch (err:any) {
        setError(`Error fetching entries: ${err.message}`)
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

  useEffect(() => {
    const fetchNotes = async () => {
      // Only attempt to fetch notes if the user is authenticated
      // AND a CURRENT_USER_ID is available.
      // We also check 'loading' to prevent fetching before auth context is ready.
      if (isAuthenticated && CURRENT_USER_ID && !loading) {
        setError(null); // Clear previous errors
        try {
          const fetchedNotes = await getNotes(CURRENT_USER_ID);
          setNotes(fetchedNotes); // Update internal notes state
          setEntries(fetchedNotes); // Update useJournal's entries state
        } catch (err: any) {
          setError(`Error loading entries: ${err.message}`);
          console.error("Error loading entries:", err);
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

  const sendLogin = async (email:string,password:string) => {
    setError(null)
    const loginTokenUser = async () => {
      try{
        const data = await login(email,password)
        if(data) {
          return data
        }
      } catch (err:any) {
        setErrorLogin(true)
        setError(err.message)
        return null
      }
    }
    const loginUser = async () => {
      try{
        
        const token = await loginTokenUser()
        if (token){
          const data = await profile(token)
          loginAuth(token,data)
        } else {
          setErrorLogin(true)
          throw new Error("Invalidad email or password")
        }
        
      } catch (err:any) {
        setError(err)
        setErrorLogin(true)
        return null
      }
    }
    loginUser()
    const data = await loginTokenUser()
    if(data){
      return true
    } else {
      return false
    }
     

  }

  const sendRegister = async (username:string,email:string,password:string) => {
    setError(null)
    const registerUser = async () => {
      try{
        const token = await register(username,email,password)
        if (token){
          const data = await profile(token)
          loginAuth(token,data)
        }
      } catch (err:any) {
        setError(err)
        console.log(error)
        return null
      }
    }
    registerUser()

  }

  
  

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading application...</div>;
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
            <div className='space-x-4'>
              {isAuthenticated && (
              <button onClick={handleNewEntryClick} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>Write Entry</button>
              )}
    
              {!isAuthenticated && (
                <button onClick={() => setModalRegisterLogin(true)} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>Write Entry</button>  
              )}

              {isAuthenticated && (
                <button onClick={logout} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>logout</button>
              )}
            </div>
            
            
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
          <WriteEntry onSave={handleSaveEntry} onCancel={() => setShowWriteEntry(false)} initialEntry={selectedEntry} CURRENT_USER_ID={CURRENT_USER_ID}/>
        </div>
      )}

      {/* Modal Login */}
      {modalLogin && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-op backdrop-blur-sm'>
          <LoginForm closeLogin={() => setModalLogin(false) } sendLogin={sendLogin}/>
        </div>
      )}
      {/* Modal Register */}
      {modalRegister && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-op backdrop-blur-sm'>
          <RegisterForm closeRegister={() => setModalRegister(false)} sendRegister={sendRegister}/>
        </div>
      )}
      {/* Modal Register/Login Prompt */}
      {modalRegisterLogin && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-op backdrop-blur-sm'> {/* Improved overlay */}
          <div className='relative w-11/12 max-w-sm p-6 bg-white rounded-xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-fade-in'> {/* Enhanced styling and animation */}

    
            <button
              type="button"
              onClick={() => setModalRegisterLogin(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className='text-xl font-semibold text-gray-900 leading-relaxed mt-4'>
              Unlock your creativity!
              <br/>
              Please login or sign up to start writing.
            </p>

            <div className='flex flex-col sm:flex-row w-full justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4'>
              <button
                className='w-full sm:flex-1 py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200'
                onClick={() => { setModalRegisterLogin(false); setModalLogin(true); }}
              >
                Login
              </button>
              <button
                className='w-full sm:flex-1 py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200'
                onClick={() => { setModalRegisterLogin(false); setModalRegister(true); }}
              >
                Register
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
    return (
        <Router> {/* Use BrowserRouter for routing */}
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    {/*<Route path="/login" element={<div>Login Page (Implement your LoginForm here)</div>} />*/}
                    {/*<Route path="/register" element={<div>Register Page (Implement your RegisterForm here)</div>} />*/}

                    {/* Private routes */}
                    {/*<Route element={<PrivateRoute />}>*/}
                        <Route path="/*" element={<AppContent />} /> {/* Catch all other routes for authenticated users */}
                    {/*</Route>*/}
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
