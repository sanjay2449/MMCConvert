import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Toaster } from "react-hot-toast";
import FileView from './components/FileView';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home setToken={setToken} />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="/file/:id" element={<FileView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
