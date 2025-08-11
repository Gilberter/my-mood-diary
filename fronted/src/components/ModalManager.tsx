import { useModal } from "../context/ModalContext";
import WriteEntry from "./WriteEntry";
import LoginForm from "./Auth/LoginForm";
import RegisterForm from "./Auth/RegisterForm";
import type  {JournalEntry} from "../types";

interface ModalManagerProps {
    CURRENT_USER_ID: string;
    handleSaveEntry: (entryToSave: JournalEntry) => void,
    initialEntry: JournalEntry | null,
    sendLogin: (email:string,password:string) => Promise<boolean>,
    sendRegister: (username:string,email:string,password:string) => void
}

export default function ModalManager({CURRENT_USER_ID, handleSaveEntry,sendLogin,sendRegister,initialEntry}: ModalManagerProps) {
    const {activeModal, openModal, closeModal} = useModal();


    if(!activeModal) return null
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-op backdrop-blur-sm">
            
            {activeModal === "writeEntry" && (
                <WriteEntry onSave={handleSaveEntry} onCancel={closeModal} CURRENT_USER_ID={CURRENT_USER_ID} initialEntry={initialEntry} />
            )}
            {activeModal === "login" && (
                <LoginForm closeLogin={closeModal} sendLogin={sendLogin} />
            )}
            {activeModal === "register" && (
                <RegisterForm closeRegister={closeModal} sendRegister={sendRegister} />
            )}
            {activeModal === "registerLogin" && (
                <div className='fixed inset-0 flex items-center justify-center z-50 bg-op backdrop-blur-sm'> {/* Improved overlay */}
                    <div className='relative w-11/12 max-w-sm p-6 bg-white rounded-xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-fade-in'> {/* Enhanced styling and animation */}

                        <button
                        type="button"
                        onClick={closeModal}
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
                            onClick={() => { closeModal(); openModal("login"); }}
                        >
                            Login
                        </button>
                        <button
                            className='w-full sm:flex-1 py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200'
                            onClick={() => { closeModal(); openModal("register"); }}
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