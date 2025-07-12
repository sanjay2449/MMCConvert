import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Toaster } from "react-hot-toast";
// import FileView from './components/FileView';
import AdminDashboard from './pages/AdminDashboard';
import QboToQbo from './pages/QboToQbo';
import SageOneToQbo from './pages/SageOneToQbo';
import XeroTOXero from './pages/XeroTOXero';
import ReckonDesktopHostedToXero from './pages/ReckonDesktopHostedToXero';


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
        <Route path="/file/qbotoqbo/:id" element={<QboToQbo />} />
        <Route path="/file/sageonetoqbo/:id" element={<SageOneToQbo />} />
        <Route path="/file/xerotoxero/:id" element={<XeroTOXero />} />
        <Route path="/file/reckondesktoptoxero/:id" element={<ReckonDesktopHostedToXero />} />
        {/* <Route path="/file/:id" element={<FileView />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
