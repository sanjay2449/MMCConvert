import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';


const Home = ({ setToken }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (email, password) => {
    if (email === 'Admin@mmcconvert.com' && password === 'MMCConvert2025') {
      setIsAdmin(true); // show SignUpForm
      return true; // admin handled
    }
    return false; // not admin
  };
  return (
    <div className="flex flex-col items-center justify-center gradient-bg min-h-screen p-4">
      <div className="gradient-bg p-2 rounded-4xl shadow">
        {isAdmin ? (
          <>
            <SignUpForm />
            <div className="flex justify-center m-3">
              <button
                onClick={() => setIsAdmin(false)}
                className="text-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-4 py-2 transition duration-200"
              >
                🔙 Back to Login
              </button>
            </div>
          </>
        ) : (
          <LoginForm setToken={setToken} onAdminLogin={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default Home;
