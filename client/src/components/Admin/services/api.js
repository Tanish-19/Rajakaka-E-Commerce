const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getAdminProfile = async () => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(data.message || 'Failed to fetch admin profile');
    }

    return data.admin;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
