import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const userSession = localStorage.getItem('userSession') ? JSON.parse(localStorage.getItem('userSession')) : null;
    const token = userSession?.token || null;
    const user = userSession?.user || null;
    const isAuthenticated = !!token && userSession?.expiry > Date.now(); // Check if the session is still valid based on expiry time

    return {
      isAuthenticated,
      token: token,
      user: user,
      isProfileComplete: userSession?.isProfileComplete || false,
      loading: false,
      error: null
    };
  }
  return {
    isAuthenticated: false,
    token: null,
    user: null,
    isProfileComplete: false,
    loading: false,
    error: null
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { token, user, expiry } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user; 
      state.loading = false;
      state.error = null;
      localStorage.setItem('userSession', JSON.stringify({ token, user, expiry }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isProfileComplete = false;
      localStorage.removeItem('userSession');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      const { token, expiry } = state; 
      localStorage.setItem('userSession', JSON.stringify({ token, user: action.payload, expiry }));
    },
    setProfileComplete: (state, action) => {
      state.isProfileComplete = action.payload;
      // Update localStorage with the new profile completion status
      const userSession = localStorage.getItem('userSession') ? JSON.parse(localStorage.getItem('userSession')) : null;
      if (userSession) {
        userSession.isProfileComplete = action.payload;
        localStorage.setItem('userSession', JSON.stringify(userSession));
      }
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, setProfileComplete } = authSlice.actions;
export default authSlice.reducer;
