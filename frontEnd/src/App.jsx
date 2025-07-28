// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useState } from 'react';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import { Toaster } from "react-hot-toast";
// import AdminDashboard from './pages/AdminDashboard';
// import QboToQbo from './pages/QboToQbo';
// import SageOneToQbo from './pages/SageOneToQbo';
// import XeroTOXero from './pages/XeroTOXero';
// import ReckonDesktopHostedToXero from './pages/ReckonDesktopHostedToXero';

// function App() {
//   const [token, setToken] = useState(() => localStorage.getItem('token'));

//   return (
//     <BrowserRouter>
//       <Toaster position="top-right" />
//       <Routes>
//         <Route path="/" element={<Home setToken={setToken} />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route
//           path="/dashboard"
//           element={token ? <Dashboard /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/file/qbotoqbo/:id"
//           element={token ? <QboToQbo /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/file/sageonetoqbo/:id"
//           element={token ? <SageOneToQbo /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/file/xerotoxero/:id"
//           element={token ? <XeroTOXero /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/file/reckondesktoptoxero/:id"
//           element={token ? <ReckonDesktopHostedToXero /> : <Navigate to="/" replace />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Toaster } from "react-hot-toast";
import AdminDashboard from './pages/AdminDashboard';
import QboToQbo from './pages/QboToQbo';
import SageOneToQbo from './pages/SageOneToQbo';
import XeroTOXero from './pages/XeroTOXero';
import ReckonDesktopHostedToXero from './pages/ReckonDesktopHostedToXero';
import Loader from './components/Loader'; // 👈 import Loader

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust loading time if needed

    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home setToken={setToken} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/file/qbotoqbo/:id"
          element={token ? <QboToQbo /> : <Navigate to="/" replace />}
        />
        <Route
          path="/file/sageonetoqbo/:id"
          element={token ? <SageOneToQbo /> : <Navigate to="/" replace />}
        />
        <Route
          path="/file/xerotoxero/:id"
          element={token ? <XeroTOXero /> : <Navigate to="/" replace />}
        />
        <Route
          path="/file/reckondesktoptoxero/:id"
          element={token ? <ReckonDesktopHostedToXero /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
