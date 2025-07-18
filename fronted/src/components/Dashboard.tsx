import React, { useMemo } from "react"; // Import useMemo
import type { JournalEntry } from "../types"; // Import the JournalEntry type
import { Calendar, BookOpen, TrendingUp, Heart, Meh, TrendingDown} from "lucide-react"; // Import any icons you need
import { startOfWeek, endOfWeek, parseISO, isWithinInterval, format } from 'date-fns'; // Import necessary date-fns functions
import { enUS } from 'date-fns/locale'; // Import a locale for consistency

interface DashboardProps {
    entries: JournalEntry[]; // Array of journal entries
}

const Dashboard: React.FC<DashboardProps> = ({entries}) => {

    const entriesThisWeek = useMemo(() => {
        const today = new Date()
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Start of the week (Monday)
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 }) // End of the week (Sunday)

        return entries.filter(entry => {
            const entryDate = parseISO(entry.date)
            return isWithinInterval(entryDate, { start: weekStart, end: weekEnd })
        })

    }, [entries])

    const getGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning!";
        if (hour < 18) return "Good afternoon!";
        return "Good evening!";
    }, []); // Only calculate once

    const entriesCountThisWeek = entriesThisWeek.length;

    return (
        
        <div className="flex flex-col space-y-6 p-6">
            {/* Greeting and Total Entries */}
            <div className="flex bg-white rounded-lg shadow-md p-6 justify-between items-start ">
                <div className="flex flex-col ">
                    <h1 className="text-2xl font-bold mb-2">{getGreeting}</h1>
                    {entries.length === 0 ? (
                        <p className="text-lg text-gray-700">Start your journaling journey today!</p>
                    ) : (
                        <p className="text-lg text-gray-700">Welcome back! Here's your summary.</p>
                    )}
                </div>
                <div className="flex flex-col items-center justify-center justify-items-center ml-4 text-center text-lg">
                    <p className="self-center">{entries.length}</p>
                    <p className="">Total Entries</p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0 lg:text-sm">
                <div className="flex bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-2 rounded-xl">
                                    <Calendar />
                                </div>
                                
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold">This Week</p>
                                    <p>Your writing activity</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">
                                <p>{entriesCountThisWeek}</p>
                                <p>Entries Written</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Words Written Card */}
                <div className="flex bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 p-2 rounded-xl">
                                    <BookOpen />
                                </div>
                                
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold">Words Written</p>
                                    <p>Total Word Count</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">
                                
                                <p>{entries.reduce((total,entry ) => total + entry.content.trim().split(' ').length, 0)}</p>
                                <p>words expressed</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mood Overview Card */}
                <div className="flex flex-col bg-white rounded-lg shadow-md p-6 justify-between">
                    <div className="flex justify-between py-2">
                        <p className="text-xl font-bold">Mood Overview</p>
                        <p>{entries.length} Entries</p>
                    </div>
                    <div className="flex ">
                        <div className="flex flex-col bg-green-100 rounded-lg p-4 mr-4">
                            < TrendingUp />
                            <p>0%</p>
                            <p>Positive</p>
                        </div>
                        <div className="flex flex-col bg-gray-200 rounded-lg p-4 mr-4">
                            < Meh />
                            <p>0%</p>
                            <p>Neutral</p>
                        </div>
                        <div className="flex flex-col bg-red-100 rounded-lg p-4 mr-4">
                            <Heart />
                            <p>0%</p>
                            <p>Challenging</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;