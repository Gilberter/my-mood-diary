import {useMemo, useState } from 'react'
import {Toaster} from 'react-hot-toast'

import useJournal  from './hooks/useJournal'; // Import the custom hook for journal entries
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

// Imports Context and Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext';
import Header from './components/Header';

type View = 'dashboard' | 'entries' | 'calendar' | 'settings' | 'tools';




function AppContent() {
  const { openModal } = useModal();
  const { user,loading } = useAuth();
  const CURRENT_USER_ID: string = user?._id || ''; // Get the actual user ID
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const journalApi = useJournal();
  const {entries, handleEditEntry, handleDeleteEntry, handleSaveEntry, selectedEntry, handleNewEntryClick} = journalApi;
  



  const navigationItems: {id:View,label:string}[] = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'entries', label: 'Entries' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
    { id: 'tools', label: 'Tools' },
  ]
  ,[])

  

  



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
        return <div>Select a view</div>
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
      <Header openModal={openModal} />

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
