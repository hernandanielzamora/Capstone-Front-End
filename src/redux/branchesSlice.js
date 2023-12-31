import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
  selectedBranchRooms: [],
};

/* Api URL */
const url = 'https://rails-b62y.onrender.com';

/* Fetch hotel branches */
export const fetchBranches = createAsyncThunk('branches/fetchBranches', async () => {
  const token = localStorage.getItem('tokenKey');
  try {
    const response = await axios.get(`${url}/branches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    }
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});

/* Reducer */
export const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default branchesSlice.reducer;
