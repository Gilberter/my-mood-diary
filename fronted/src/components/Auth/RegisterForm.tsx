import React, {  useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // or use any icon library you prefer
import { register } from "../../services/userServices";
import { useAuth } from "../../context/AuthContext";


interface RegisterFormprops {
    closeRegister: () => void,
    

}

const RegisterForm: React.FC<RegisterFormprops> = ({closeRegister}) => {
    const [username,setUsername] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatchError, setPasswordMismatchError] = useState('');
    const { loginAuth } = useAuth();

    const handleSubmit = async (e:any) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (password !== confirmPassword) {
          setPasswordMismatchError("Passwords don't match.");
        return; // Stop the submission
        } else {
          setPasswordMismatchError(""); // Clear error if they match
        }
        if (password.length < 10){
          setPasswordMismatchError("Passwords are short");
        }

        const res = await sendRegister(username, email, password);
        if(res) {
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword(""); // Clear confirm password field too
          closeRegister()
        } else {
          setUsername(username);
          setEmail(email);
          setPassword("");
          setConfirmPassword(""); // Clear confirm password field too
          
        }
        
    };

    const sendRegister = async (username:string,email:string,password:string) => {
      const response = await register(username,email,password)
      if(response == null){
        setPasswordMismatchError("Problem with the internet connection")
        return false
      } 

      const resLogin = await loginAuth(email,password)
      if(resLogin){
        return true
      } else {
        return false
      }
      
    }

    return (
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-md p-6 bg-white rounded-xl shadow-xl flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Create Your Account</h2>

        {/* Username Field */}
        <div className="w-full">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            type="text" // Changed to 'text' as username isn't an email
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required // Add required attribute for basic HTML validation
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>

        {/* Email Field */}
        <div className="w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          />
        </div>

        {/* Password Field */}
        <div className="w-full">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              required
              className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {/* Replace with your actual Eye/EyeOff icons if using a library like react-feather */}
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field (NEW) */}
        <div className="w-full">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          />
          {passwordMismatchError && (
            <p className="mt-1 text-sm text-red-600">{passwordMismatchError}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-end space-x-4 mt-8"> {/* Adjusted spacing and alignment */}
          <button
            type="button" // Important: type="button" for Cancel
            className="flex-1 py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
            onClick={closeRegister}
          >
            Cancel
          </button>
          <button
            type="submit" // Type submit for the register button
            className="flex-1 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Register
          </button>
        </div>
      </form>
    </div>
    )
}
export default RegisterForm