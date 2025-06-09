// export default AdminDashboard;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminDashboard = () => {
        const [users, setUsers] = useState([]);
        const [filteredUsers, setFilteredUsers] = useState([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingUser, setEditingUser] = useState(null);
        const [search, setSearch] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [userToDelete, setUserToDelete] = useState(null);
        const usersPerPage = 10;
        const navigate = useNavigate();

        // ✅ Admin auth check: redirect if no token
        useEffect(() => {
                const token = localStorage.getItem('adminToken');
                if (!token || token !== 'MMC_ADMIN_AUTHORIZED') {
                        toast.error('Unauthorized access. Please login first.');
                        navigate('/');
                } else {
                        fetchUsers();
                }
        }, []);

        const fetchUsers = async () => {
                try {
                        const res = await axios.get('/api/users');
                        setUsers(res.data);
                        setFilteredUsers(res.data);
                } catch (error) {
                        toast.error('Error fetching users');
                        console.error(error);
                }
        };

        const PasswordField = ({ password }) => {
                const [show, setShow] = useState(false);
                const [isAdmin, setIsAdmin] = useState(false);

                useEffect(() => {
                        const token = localStorage.getItem('adminToken');
                        if (token === 'MMC_ADMIN_AUTHORIZED') {
                                setIsAdmin(true);
                        }
                }, []);

                if (!isAdmin) {
                        return <span className="italic text-gray-300">Hidden</span>;
                }

                return (
                        <span className="flex items-center gap-2">
                                <span className={`transition-all ${show ? 'text-white' : 'tracking-widest text-gray-300'}`}>
                                        {show ? password : '•'.repeat(password.length)}
                                </span>
                                <button
                                        onClick={() => setShow(!show)}
                                        className="text-white hover:text-blue-300 transition duration-300 transform hover:scale-110"
                                        title={show ? 'Hide Password' : 'Show Password'}
                                >
                                        {show ? <FaEyeSlash /> : <FaEye />}
                                </button>
                        </span>
                );
        };


        const handleSearch = (query) => {
                setSearch(query);
                const filtered = users.filter((u) =>
                        (u.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
                        (u.email?.toLowerCase() || '').includes(query.toLowerCase())
                );
                setFilteredUsers(filtered);
                setCurrentPage(1);
        };

        const confirmDelete = async () => {
                try {
                        await axios.delete(`/api/users/${userToDelete._id}`);
                        toast.success('User deleted successfully');
                        setUserToDelete(null);
                        fetchUsers();
                } catch (error) {
                        toast.error('Failed to delete user');
                        console.error(error);
                }
        };

        const handleCloseModal = () => {
                setIsModalOpen(false);
                setEditingUser(null);
                fetchUsers();
        };

        const paginatedUsers = filteredUsers.slice(
                (currentPage - 1) * usersPerPage,
                currentPage * usersPerPage
        );
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

        // ✅ Logout function
        const logout = () => {
                localStorage.removeItem('adminToken');
                navigate('/');
        };

        return (
                <div className="min-h-screen gradient-bg p-8 relative">

                        {/* 🔒 Logout Button (Top Left) */}
                        <button
                                onClick={logout}
                                className="absolute text-white text-2xl hover:text-red-400 transition duration-200"
                                title="Logout"
                        >
                                <FaSignOutAlt />
                        </button>

                        {/* Heading & Add Button */}
                        <div className="flex flex-col md:flex-row justify-between mb-6">
                                <h1 className="text-3xl font-bold font-serif underline text-white text-center w-full mb-4 md:mb-0">
                                        Registered Users
                                </h1>
                                <button
                                        onClick={() => {
                                                setEditingUser(null);
                                                setIsModalOpen(true);
                                        }}
                                        className="gradient-bg from-blue-500 to-indigo-600 text-white font-bold rounded-full hover:scale-105 hover:from-indigo-500 hover:to-blue-600 transition duration-300 shadow-lg"
                                >
                                        ➕ Add User
                                </button>
                        </div>

                        {/* Search Input */}
                        <div className="mb-4">
                                <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                                />
                        </div>

                        {/* Users List */}
                        <div className="shadow-md rounded-lg p-4 bg-white/10 backdrop-blur">
                                {paginatedUsers.length > 0 ? (
                                        <div className="w-full rounded-lg overflow-hidden overflow-x-auto">
                                                {/* Header */}
                                                <div className="flex font-bold text-white bg-blue-800 py-3 px-4 border-b border-white/30">
                                                        <div className="w-1/4 flex items-center gap-2"><span>👤</span>Name</div>
                                                        <div className="w-1/4 flex items-center gap-2"><span>📧</span>Email</div>
                                                        <div className="w-1/4 flex items-center gap-2"><span>🔒</span>Password</div>
                                                        <div className="w-1/4 text-end">Action</div>
                                                </div>

                                                {/* Rows */}
                                                {paginatedUsers.map((user) => (
                                                        <div
                                                                key={user._id}
                                                                className="flex items-center text-white font-serif py-3 px-4 border-b border-white/10 hover:bg-white/10 transition"
                                                        >
                                                                <div className="w-1/4 truncate">{user.name}</div>
                                                                <div className="w-1/4 truncate">{user.email}</div>
                                                                <div className="w-1/4"><PasswordField password={user.password} /></div>
                                                                <div className="w-1/4 flex justify-end">
                                                                        <button
                                                                                onClick={() => setUserToDelete(user)}
                                                                                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                                                        >
                                                                                Delete
                                                                        </button>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>


                                ) : (
                                        <p className="text-white text-center">No users found.</p>
                                )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                                <div className="flex justify-center mt-4 space-x-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-black hover:bg-gray-300'
                                                                }`}
                                                >
                                                        {i + 1}
                                                </button>
                                        ))}
                                </div>
                        )}

                        {/* Add User Modal */}
                        {isModalOpen && (
                                <div className="fixed inset-0 z-50 gradient-bg bg-opacity-40 flex justify-center items-center">
                                        <div className="gradient-bg rounded-xl shadow-lg p-6 relative w-full max-w-md">
                                                <button
                                                        onClick={handleCloseModal}
                                                        className="absolute top-3 right-4 text-2xl text-white hover:text-red-400"
                                                >
                                                        &times;
                                                </button>
                                                <SignUpForm user={editingUser} onSuccess={handleCloseModal} />
                                        </div>
                                </div>
                        )}

                        {/* Confirm Delete Modal */}
                        {userToDelete && (
                                <div className="fixed inset-0 z-50 gradient-bg bg-opacity-50 flex justify-center items-center">
                                        <div className="gradient-bg rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                                                <h2 className="text-xl font-bold mb-4 text-white">Delete User?</h2>
                                                <p className="mb-6 text-white">
                                                        Are you sure you want to delete <strong>{userToDelete.name}</strong>?
                                                </p>
                                                <div className="flex justify-center gap-4">
                                                        <button
                                                                onClick={() => setUserToDelete(null)}
                                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                                        >
                                                                Cancel
                                                        </button>
                                                        <button
                                                                onClick={confirmDelete}
                                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                                        >
                                                                Yes, Delete
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default AdminDashboard;
