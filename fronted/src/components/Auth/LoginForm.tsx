
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // or use any icon library you prefer


interface LoginFormProps {
    closeLogin: () => void,
    sendLogin: (email:string,password:string) =>  Promise<boolean>;


}


const LoginForm: React.FC<LoginFormProps> = ({closeLogin, sendLogin}) => {
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorLogin, setErrorLogin] = useState<boolean>(false);

    const handleSumbit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const response = await sendLogin(email,password)
            if (response) {
                setEmail("")
                setPassword("")
                closeLogin()
            } else {
                setEmail(email)
                setPassword(password)
                setErrorLogin(true)
            }
        } catch (err:any) {
            throw new Error("Invalid form")
        }
    }

    return (
        <div className="w-1/2 sm:w-1/4 max-w-2xl space-y-4 sm:space-y-6 p-4 sm:p-6 bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
            <form className="w-full flex flex-col justify-center items-center space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Login</h2>
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="email" />
                </div>
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type={showPassword ? "text" : "password"}
                            className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                
                {errorLogin ? (
                    <div>
                        <p className="mt-1 text-sm text-red-600">Invalidad Email or Password Try-Again</p>
                        <div className="flex justify-between space-x-6">
                            <button className="inline-flex justify-center py-2 px-4 cursor-pointer border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={closeLogin}>Cancel</button>
                            <button className="inline-flex justify-center py-2 px-4 cursor-pointer border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleSumbit}
                                 type="submit">Login</button>
                        </div>
                        </div>
                ) : (
                    <div className="flex justify-between space-x-6">
                        <button className="inline-flex justify-center py-2 px-4 cursor-pointer border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={closeLogin}>Cancel</button>
                        <button className="inline-flex justify-center py-2 px-4 cursor-pointer border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleSumbit}
                             type="submit">Login</button>
                     </div>
                )}
                
                
            </form>
            
        </div>
    )
}

export default LoginForm