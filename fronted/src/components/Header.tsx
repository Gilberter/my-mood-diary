
type modalType = "writeEntry" | "login" | "register" | "registerLogin" | null


interface HeaderProps {
    openModal: (type: modalType) => void,
    isAuthenticated: boolean,
    logoutAuth: () => void
}

const Header: React.FC<HeaderProps> = ({openModal,isAuthenticated,logoutAuth}) => {
    return (
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
                    <button onClick={() => openModal("writeEntry")} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>Write Entry</button>
                    )}
            
                    {!isAuthenticated && (
                        <button onClick={() => openModal("registerLogin")} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>Write Entry</button>  
                    )}

                    {isAuthenticated && (
                        <button onClick={logoutAuth} className='text-1xl rounded-lg  cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-white save-button'>logout</button>
                    )}
                    </div>
                    
                    
                </div>
            </div>
      </header>
    )
}

export default Header