import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  role: 'Viewer' | 'Admin';
}

const initialState: AppState = {
  sidebarOpen: true,
  theme: 'light',
  role: 'Viewer',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setRole: (state, action: PayloadAction<'Viewer' | 'Admin'>) => {
      state.role = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setRole } = appSlice.actions;
export default appSlice.reducer;
