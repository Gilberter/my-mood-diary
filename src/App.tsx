import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
        return <div>Dashboard View</div>;
      case 'entries':
        return <div>Entries View</div>;
      case 'calendar':
        return <div>Calendar View</div>;
      case 'settings':
        return <div>Settings View</div>;
      default:
        return <div>Select a view</div>;
    }
  }

  return (
    <div>
      {/* Header */}
      <header >
        <div>
          <span>MD</span>
          <h1>Mood Diary</h1>
          <button>Write Entry</button>
        </div>
      </header>
      <div>
        {/* Sidebar */}
        <aside>
          <nav>
            <div>
              { navigationItems.map( (item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </aside>
        <main>
          {renderCurrentView()}
        </main>
      </div>

    </div>
  )
}

export default App
