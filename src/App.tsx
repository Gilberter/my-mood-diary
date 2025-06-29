import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import './App.css'

type View = 'dashboard' | 'entries' | 'calendar' | 'settings';


function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showWriteEntry, setShowWriteEntry] = useState(false);
  const [selectedEntry, setSelectedEntrty] = useState<string | null>(null);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'entries', label: 'Entries' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'settings', label: 'Settings' },
  ]

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <div>Dashboard</div>
      case 'entries':
        return (
          <div className="space-y-6">
            <div className='flex-col '>
              <div className='flex mx-auto items-center gap-4 mb-6'>
                <h1 className="text-2xl font-bold text-gray-900">Your Journal Entries</h1>
                <p className='text-gray-600'>0 Entries</p>
              </div>
              <div className='flex-col p-8 items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-center'>
                <div className='text-4xl mb-4'>✍️</div>
                <h3 className='text-xl font-bold mb-4'>No entries yet</h3>
                <p className='text-gray-600 mb-3'>Start writing to see your entries here</p>
                <button>
                  <span className="text-white bg-purple-600 px-4 py-2 rounded-lg">Write Entry</span>
                </button>
              </div>
            </div>
            
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Coming Soon</h3>
              <p className="text-gray-600">Track your mood patterns over time with our interactive calendar view.</p>
            </div>
          </div>
        );
      case 'settings':
        return <div>Settings View</div>;
      default:
        return <div>Select a view</div>;
    }
  }

  return (
    <div className='min-h-screen bg-gray-50' >
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
            <button className='text-2xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white bg-purple-600'>Write Entry</button>
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

    </div>
  )
}

export default App
