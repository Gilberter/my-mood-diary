import React from "react";
import type { JournalEntry } from "../types"; // Import the JournalEntry type

interface DashboardProps {
    entries: JournalEntry[]; // Array of journal entries
}

const Dashboard: React.FC<DashboardProps> = ({entries}) => {
    return (
        <div className="flex flex-col space-y-6 p-6">
            <div className="flex bg-white rounded-lg shadow-md p-6 ">
                <div className="flex flex-col">
                    <h1>Good evening! </h1>
                    <p>Start yout journaling journey today!</p>
                </div>
                <div className="flex flex-col items-center justify-center justify-items-center ml-4 ">
                    <p className="self-center">{entries.length}</p>
                    <p>Total Entries</p>
                </div>
            </div>
            <div className="flex bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <div className="flex items-center space-x-4">
                            <p>Icon</p>
                            <div className="flex flex-col">
                                <p>This Week</p>
                                <p>Your writing activity</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>{entries.length}</p>
                            <p>Entries Written</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex bg-white rounded-lg shadow-md p-6">
                <div>
                    <p>Icon</p>
                    <div>
                        <p>Words Written</p>
                        <p>Total word count</p>
                    </div>
                    <p>{entries.length}</p>
                    <p>Words expressed</p>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg shadow-md p-6 justify-between">
                <div>
                    <p>Mood Overview</p>
                    <p>{entries.length}</p>
                </div>
                <div className="flex ">
                    <div className="flex flex-col bg-gray-100 rounded-lg p-4 mr-4">
                        <p>Icon</p>
                        <p>0%</p>
                        <p>Positive</p>
                    </div>
                    <div className="flex flex-col bg-gray-100 rounded-lg p-4 mr-4">
                        <p>Icon</p>
                        <p>0%</p>
                        <p>Neutral</p>
                    </div>
                    <div className="flex flex-col bg-gray-100 rounded-lg p-4">
                        <p>Icon</p>
                        <p>0%</p>
                        <p>Challenging</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;