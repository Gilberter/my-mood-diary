import React, { useMemo, useState } from 'react'
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import EntryCard from './EntryCard'; // Import the EntryCard component
import type { JournalEntry } from "../types"; // Import the JournalEntry type
import { format, parseISO} from 'date-fns';

interface CalendarProps {
    entries: JournalEntry[]; // Array of journal entries
}


const CalendarComponent: React.FC<CalendarProps> = ({entries}) => {

    const entryCountsByDays = useMemo(() => {
        const counts = new Map<string, number>()
        entries.forEach(entry => {
            const dateKey = (entry.date);   
            counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
        })
        return counts
    }, [entries])

    const [showEntryDay, setShowEntryDay] = useState<Date | null>(null);
    const [toggleModal, setToggleModal] = useState(false);

    function handleModal(){
        setToggleModal(!toggleModal);
        setShowEntryDay(null)
    }

    function handleNoEntry(showEntryDay: Date | null) {
        if (showEntryDay != null) {
            if (entries.filter(entry => parseISO(entry.date).toDateString() === showEntryDay.toDateString()).length == 0){
                return true;
            }
        } else {
            return false;
        }
    }


    return (
        <div className='w-full'>
            <div className=" space-y-6">
                {entries.length > 0 ? (
                    
                    <div className='flex flex-col space-y-6 justify-center items-center w-full'>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Calendar View</h1>
                        
                        <Calendar  
                            tileContent={({ date, view }) => {
                                if (view === 'month') {
                                    const count = entryCountsByDays.get(format(date, 'yyyy-MM-dd')) || 0;
                                

                                    return count > 0 ? (
                                        <div className="text-xs mt-1 text-blue-500 font-bold">
                                            {count}
                                        </div>
                                    ) : null;
                                }
                            }}
                            onClickDay={(date) => {
                                setToggleModal(true);
                                setShowEntryDay(date)
                            }}
                            className="react-calendar-custom  md:max-w-md lg:max-w-lg xl:max-w-xl"
                        />
                    </div>
                ) : (
                    <div className=' space-y-6' >
                        <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Coming Soon</h3>
                            <p className='text-gray-600 mb-3'>Start writing to see your calendar tracking</p>
                            <p className="text-gray-600">Track your mood patterns over time with our interactive calendar view.</p> 

                        </div>
                    </div>
                )}
            </div>
            {toggleModal == true && showEntryDay != null&&(
                <div className='overflow-y-auto fixed inset-0 bg-gray-900 bg-opacity-10 flex items-center justify-center z-50  sm:p-6'>
                    <div className='max-w-sm  w-full max-h-[90vh] flex flex-col'>
                        
                        <h1 className='rounded-xl shadow-sm bg-white p-3 mb-4'>Notes for this day</h1>
                        <div className=' flex-grow  '>
                            {
                                entries.filter(entry => parseISO(entry.date).toDateString() === showEntryDay.toDateString()).map(entry => (
    
                                    <EntryCard key={entry._id} entry={entry} onEdit={() => null} onDelete={()=>null}/>
                                    
                                ))
                            }
                        </div>
                        
                        <button onClick={handleModal} className='save-button mb-10'>Cancel</button>
                    </div>
                </div>
            )}
            {toggleModal == true && handleNoEntry(showEntryDay) &&(
                
                <div className='w-full fixed inset-0 bg-op flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg shadow-md p-6 mb-4 space-y-6 text-center'>
                        <h1>No notes for this day</h1>
                        <button onClick={handleModal} className='save-button'>Cancel</button>
                    </div>
                </div>
            
            )}
        </div>
        
    )
}





export default CalendarComponent;