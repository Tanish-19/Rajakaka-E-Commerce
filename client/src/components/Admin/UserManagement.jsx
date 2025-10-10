import { useState, useEffect } from 'react';
import { User, X, RefreshCw, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/users?page=${page}&limit=20`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data || []);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setSelectedUser(result.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded-lg transition-all ${
            currentPage === i
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600 mt-1">
            Total Users: {pagination.totalUsers} | Page {currentPage} of {pagination.totalPages}
          </p>
        </div>
        <button
          onClick={() => fetchUsers(currentPage)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-all">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                pagination.hasPrevPage
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex items-center">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 mx-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                </>
              )}

              {renderPageNumbers()}

              {currentPage < pagination.totalPages - 2 && (
                <>
                  {currentPage < pagination.totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="px-3 py-1 mx-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                pagination.hasNextPage
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-xl flex justify-between items-center">
              <h3 className="text-2xl font-bold">User Details</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-blue-700 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={40} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h4>
                  <p className="text-gray-600">Customer ID: {selectedUser._id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={20} className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Email</span>
                  </div>
                  <p className="text-gray-700 ml-8">{selectedUser.email}</p>
                </div>

                {selectedUser.phone && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone size={20} className="text-blue-600" />
                      <span className="font-semibold text-gray-800">Phone Number</span>
                    </div>
                    <p className="text-gray-700 ml-8">{selectedUser.phone}</p>
                  </div>
                )}

                {selectedUser.address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin size={20} className="text-blue-600" />
                      <span className="font-semibold text-gray-800">Address</span>
                    </div>
                    <div className="text-gray-700 ml-8 space-y-1">
                      <p>{selectedUser.address}</p>
                      {selectedUser.city && (
                        <p>
                          {selectedUser.city}
                          {selectedUser.state && `, ${selectedUser.state}`}
                          {selectedUser.pinCode && ` - ${selectedUser.pinCode}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {selectedUser.lastLogin && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Last Login</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(selectedUser.lastLogin).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;