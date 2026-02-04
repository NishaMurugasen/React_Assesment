import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '../../services/api';

// Thunks
export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  // ReqRes only has 12 users total spanning 2 pages. We'll fetch one big page for the "Client Side" experience
  const response = await usersAPI.fetchUsers(1); 
  return response.data.data; 
});

export const createUser = createAsyncThunk('users/create', async (userData) => {
  const response = await usersAPI.create(userData);
  // ReqRes returns the object created with an ID.
  return { ...userData, id: response.data.id || Date.now() }; // Fallback ID for mock
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }) => {
  await usersAPI.update(id, data);
  return { id, ...data };
});

export const deleteUser = createAsyncThunk('users/delete', async (id) => {
  await usersAPI.delete(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle', // idle | loading | succeeded | failed
    viewMode: 'table', // 'table' or 'card'
  },
  reducers: {
    setViewMode: (state, action) => { state.viewMode = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => { 
        state.status = 'succeeded'; 
        state.list = action.payload; 
      })
      // Optimistic updates for CRUD
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Add to top
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u.id !== action.payload);
      });
  },
});

export const { setViewMode } = usersSlice.actions;
export default usersSlice.reducer;