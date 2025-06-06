// export default Home;
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';

const Home = ({ setToken }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    if (email === 'Admin@mmcconvert.com' && password === 'MMCConvert2025') {
      setIsAdmin(true);
      navigate('/admin'); // Navigate to Admin Dashboard
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center gradient-bg min-h-screen p-4">
      <div className="gradient-bg p-2 rounded-4xl shadow">
        <LoginForm setToken={setToken} onAdminLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Home;
