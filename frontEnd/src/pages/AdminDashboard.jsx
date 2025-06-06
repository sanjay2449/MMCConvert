import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
        const [users, setUsers] = useState([]);
        const [filteredUsers, setFilteredUsers] = useState([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingUser, setEditingUser] = useState(null);
        const [search, setSearch] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [userToDelete, setUserToDelete] = useState(null);
        const usersPerPage = 5;
        const navigate = useNavigate();

        useEffect(() => {
                fetchUsers();
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

        return (
                <div className="min-h-screen gradient-bg p-8 relative">

                        {/* Top-left Exit Icon */}
                        <button
                                onClick={() => navigate('/')}
                                className="absolute text-white text-2xl hover:text-red-400 transition duration-200"
                                title="Back to Login"
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
                                        <ul className="space-y-3">
                                                {paginatedUsers.map((user) => (
                                                        <li
                                                                key={user._id}
                                                                className="border-b border-white/20 text-md text-white font-serif rounded-md px-4 py-3 bg-white/5 flex justify-between items-start"
                                                        >
                                                                <div>
                                                                        <p><strong>👤 Name:</strong> {user.name}</p>
                                                                        <p><strong>📧 Email:</strong> {user.email}</p>
                                                                        {/* <p><strong>🔑 Password:</strong> {user.password}</p> */}
                                                                </div>
                                                                <button
                                                                        onClick={() => setUserToDelete(user)}
                                                                        className="text-white bg-red-600 h-fit px-3 py-1 rounded hover:bg-red-700"
                                                                >
                                                                        Delete
                                                                </button>
                                                        </li>

                                                ))}

                                        </ul>
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
                                <div className="fixed inset-0 z-50 gradient-bg  bg-opacity-40 flex justify-center items-center">
                                        <div className="gradient-bg rounded-xl shadow-lg p-6 relative w-full max-w-md">
                                                <button
                                                        onClick={handleCloseModal}
                                                        className="absolute top-3 right-4 text-2xl text-white hover:text-red-400"
                                                >
                                                        &times;
                                                </button>
                                                {/* <h2 className="text-xl font-bold text-white mb-4 text-center">
                                                        {editingUser ? 'Edit User' : 'Add New User'}
                                                </h2> */}
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
