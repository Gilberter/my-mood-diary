import type { JournalEntry } from "../types"
import EntryCard from "./EntryCard"

interface EntriesCardsProps {
    entries: JournalEntry[],
    handleEditEntry: (entry: JournalEntry) => void,
    handleDeleteEntry: (entry: JournalEntry) => void,
    handleNewEntryClick: () => void
}

const EntriesCards: React.FC<EntriesCardsProps> = ({entries,handleEditEntry,handleDeleteEntry,handleNewEntryClick}) => {
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
}

export default EntriesCards