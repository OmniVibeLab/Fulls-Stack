// Simple auth service using localStorage
const authService = {
  register: (userData) => {
    const newUser = {
      ...userData,
      bio: '',
      location: '',
      website: '',
      avatar: null,
      joinedDate: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    return Promise.resolve({ success: true });
  },

  login: (email, password) => {
    // For demo, accept any email/password
    const userData = {
      email,
      fullName: email.split('@')[0],
      bio: '',
      location: '',
      website: '',
      avatar: null,
      joinedDate: new Date().toISOString(),
      token: 'demo-token'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    return Promise.resolve(userData);
  },

  logout: () => {
    localStorage.removeItem('user');
    return Promise.resolve(true);
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  updateProfile: (updates) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return Promise.resolve(updatedUser);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService;