import { useEffect, useState } from 'react';
import { FaRocket, FaFolder, FaCheck, FaEye } from 'react-icons/fa';
import NewFileModal from '../components/NewFileModal';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ fileName: '', softwareType: '', countryName: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchFiles();
  }, []);


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
    }
  };

  const runningFiles = files.filter(f => f.status === 'running');
  const completedFiles = files.filter(f => f.status === 'completed');

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navbar user={user} />
      <div className="min-h-screen gradient-bg text-white px-10 py-8">
        <Toaster position="top-right" />
        <NewFileModal isOpen={modalOpen} setIsOpen={setModalOpen} onAddFile={handleCreate} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaFolder className="text-yellow-400" />
            File Dashboard
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
          >
            + Create New File
          </button>
        </div>

        <section className="mb-8 gradient-bg border-2 border-gray-700 p-6 rounded-3xl shadow-lg">
          <h2 className=" gradient-bg  text-xl font-semibold mb-4 flex items-center gap-2 underline">
            <FaRocket className="text-pink-400" />
            Running Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {runningFiles.map(file => (
              <div key={file._id} className="gradient-bg p-4 rounded-xl shadow-lg">
                <p className="text-lg font-semibold font-serif underline mb-1">{file.fileName}</p>
                <p className="text-sm font-semibold font-mono text-gray-300">{file.softwareType}</p>
                <p className="text-sm font-semibold font-mono text-gray-300">{file.countryName}</p>
                <p className="text-sm font-semibold font-mono text-gray-300">{file.currencyStatus}</p>
                <p className="text-sm font-semibold font-mono text-gray-300 mb-1">{file.createdAt}</p>
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
                        alert("type: " + type);
                      }
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaEye />
                    Open
                  </button>
                  <button
                    onClick={() => markAsRead(file._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaCheck />
                    Mark as Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-8 gradient-bg border-2 border-gray-700 p-6 rounded-3xl shadow-lg'>
          <h2 className="gradient-bg  text-xl font-semibold mb-4 flex items-center gap-2 underline">
            <FaCheck className="text-green-400 " />
            Completed Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedFiles.map(file => (
              <div key={file._id} className="gradient-bg p-4 rounded-xl shadow-lg">
                <p className="text-lg font-semibold font-serif  line-through mb-1">{file.fileName}</p>
                <p className="text-sm font-semibold font-mono text-gray-300">{file.softwareType}</p>
                <p className="text-sm font-semibold font-mono text-gray-300">{file.countryName}</p>
                <p className="text-sm font-semibold font-mono text-gray-300 mb-1">{file.createdAt}</p>
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
                      alert("type: " + type);
                    }
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FaEye />
                  Open
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
