// import { useEffect, useState, useRef } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import { FaRocket, FaFolder, FaCheck, FaEye, FaCode } from 'react-icons/fa';
import NewFileModal from '../components/NewFileModal';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import smoothscroll from 'smoothscroll-polyfill';

const Dashboard = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const runningRef = useRef(null);
  const completedRef = useRef(null);
  // Polyfill for smooth scrolling in older browsers
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ fileName: '', softwareType: '', countryName: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    fetchFiles();
  }, []);

  // Debounce search term to reduce API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  const handleCreate = async (newFile) => {
    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFile),
      });
      const data = await res.json();
      setFiles([...files, data]);
      setForm({ fileName: '', softwareType: '', countryName: '' });
    } catch (err) {
      console.error("File creation failed:", err);
    }
  };

  const markAsRead = async (id) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' }),
      });
      const updated = await res.json();
      setFiles(files.map(file => (file._id === id ? updated : file)));
    } catch (err) {
      console.error("Failed to update file status:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.fileName.toLowerCase().includes(debouncedSearchTerm) ||
      f.softwareType.toLowerCase().includes(debouncedSearchTerm)
  );

  const runningFiles = filteredFiles.filter(f => f.status === 'running');
  const completedFiles = filteredFiles.filter(f => f.status === 'completed');

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-[#0f172a] text-white rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };


  return (
    <div className="min-h-screen flex flex-col gradient-bg text-white">
      <Navbar user={user} />
      <div className="flex-grow px-10 py-8 overflow-auto">
      {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaFolder className="text-yellow-400" />
            File Dashboard
          </h1>
        </div>

        {/* Summary Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div
            onClick={() => runningRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#0f172a] rounded-lg shadow flex flex-col items-center">
            <span className="text-sm text-gray-400">Running Files</span>
            <span className="text-2xl font-bold">{runningFiles.length}</span>
          </div>
          <div
            onClick={() => completedRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#0f172a] rounded-lg shadow flex flex-col items-center">
            <span className="text-sm text-gray-400">Completed Files</span>
            <span className="text-2xl font-bold">{completedFiles.length}</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Search by Name or Software-type..."
              className="bg-gray-800 border border-gray-600 px-2 py-3 rounded w-full md:w-75 text-sm text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <Toaster position="top-right" />
          <NewFileModal isOpen={modalOpen} setIsOpen={setModalOpen} onAddFile={handleCreate} />
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
          >
            + Create New File
          </button>
        </div>

        {/* Running Files */}
        <section
          ref={runningRef}
          className="mb-8 gradient-bg border-2 border-gray-700 p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 underline">
            <FaRocket className="text-pink-400" />
            Running Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {runningFiles.length === 0 && (
              <p className="col-span-full text-center text-gray-400 italic">No running files found.</p>
            )}
            {runningFiles.map(file => (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="gradient-bg p-4 rounded-xl shadow-lg border-l-4 border-yellow-500"
              >
                <p className="text-lg font-semibold font-serif underline mb-1">
                  {highlightMatch(file.fileName, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300">
                  {highlightMatch(file.softwareType, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300">
                  {highlightMatch(file.countryName, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300">
                  {highlightMatch(file.currencyStatus, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300 mb-2">
                  {format(new Date(file.createdAt), 'dd MMM yyyy, hh:mm a')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const type = file.softwareType.toLowerCase();
                      if (type === 'qbo to qbo') {
                        navigate(`/file/qbotoqbo/${file._id}`, { state: { file } });
                      } else if (type === 'sage one to qbo') {
                        navigate(`/file/sageonetoqbo/${file._id}`, { state: { file } });
                      } else if (type === 'xero to xero') {
                        navigate(`/file/xerotoxero/${file._id}`, { state: { file } });
                      } else if (type === 'reckon desktop to xero') {
                        navigate(`/file/reckondesktoptoxero/${file._id}`, { state: { file } });
                      } else {
                        alert("Unsupported software type: " + file.softwareType);
                      }
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaEye />
                    Open
                  </button>
                  <button
                    disabled={loadingId === file._id}
                    onClick={() => markAsRead(file._id)}
                    className={`px-3 py-1 rounded flex items-center gap-1 ${loadingId === file._id
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                      }`}
                  >
                    {loadingId === file._id ? (
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <>
                        <FaCheck />
                        Mark as Completed
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Completed Files */}
        <section
          ref={completedRef}
          className='mb-8 gradient-bg border-2 border-gray-700 p-6 rounded-3xl shadow-lg'>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 underline">
            <FaCheck className="text-green-400" />
            Completed Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedFiles.length === 0 && (
              <p className="col-span-full text-center text-gray-400 italic">No completed files found.</p>
            )}
            {completedFiles.map(file => (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f172a] p-4 rounded-xl shadow-lg border-l-4 border-green-500"
              >
                <p className="text-lg font-semibold font-serif line-through mb-1">
                  {highlightMatch(file.fileName, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300">
                  {highlightMatch(file.softwareType, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300">
                  {highlightMatch(file.countryName, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300">
                  {highlightMatch(file.currencyStatus, debouncedSearchTerm)}
                </p>
                <p className="text-sm font-mono text-gray-300 mb-2">
                  {format(new Date(file.createdAt), 'dd MMM yyyy, hh:mm a')}
                </p>
                <button
                  onClick={() => {
                    const type = file.softwareType.toLowerCase();
                    if (type === 'qbo to qbo') {
                      navigate(`/file/qbotoqbo/${file._id}`, { state: { file } });
                    } else if (type === 'sage one to qbo') {
                      navigate(`/file/sageonetoqbo/${file._id}`, { state: { file } });
                    } else if (type === 'xero to xero') {
                      navigate(`/file/xerotoxero/${file._id}`, { state: { file } });
                    } else if (type === 'reckon desktop/hosted to xero') {
                      navigate(`/file/reckondesktophostedtoxero/${file._id}`, { state: { file } });
                    } else {
                      alert("Unsupported software type: " + file.softwareType);
                    }
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FaEye />
                  Open
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-blue-800 text-gray-400 text-sm py-4 fixed bottom-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold tracking-wide">MMC Convert</span>
            <span className="text-gray-400">|</span>
            <FaCode className="text-blue-400" />
            <span className="italic font-serif">User Dashboard</span>
          </div>
          <div className="text-xs text-gray-500 tracking-wider">
            © {new Date().getFullYear()} MMC Convert. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
