import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  name: 'rooms',
  rooms: [],
  roomsInfo: {},
  status: 'idle',
};

/* API Url */
const url = 'https://rails-b62y.onrender.com';

// Fetch Rooms
export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  const token = localStorage.getItem('tokenKey');

  try {
    const response = await axios.get(`${url}/rooms`, {
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

// Fetch Rooms Details

export const fetchRoomsDetails = createAsyncThunk('rooms/fetchRoomsDetails', async (id) => {
  const token = localStorage.getItem('tokenKey');
  const response = await fetch(`${url}/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  throw new Error('Something went wrong!');
});

// POST room
/* eslint-disable camelcase */
export const createRoom = createAsyncThunk('rooms/createRoom', async ({
  name, photo, cost, description, guest, beds, branch_id,
}) => {
  const token = localStorage.getItem('tokenKey');

  const payload = {
    name,
    photo,
    cost,
    description,
    guest,
    beds,
    branch_id,
  };
  try {
    const response = await axios.post(`${url}/rooms`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Room

export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id) => {
  const token = localStorage.getItem('tokenKey');

  const response = await axios.delete(`${url}/rooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status) {
    return id;
  }

  throw new Error('Something went wrong!');
});

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    selectedRoom: (state, action) => {
      const selectedRoom = action.payload;
      return {
        ...state,
        roomsInfo: selectedRoom,
      };
    },
    addRoom: (state, action) => {
      const newRoom = action.payload;
      state.rooms.push(newRoom);
    },
    deleteRoomReducer: (state, action) => {
      const id = action.payload;
      state.rooms = state.rooms.filter((room) => room.id !== id);
    },
  },
  extraReducers: (build) => {
    build
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRooms.fulfilled, (state, action) => ({
        ...state,
        status: 'success',
        rooms: action.payload,
      }))
      .addCase(fetchRooms.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(fetchRoomsDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoomsDetails.fulfilled, (state, action) => ({
        ...state,
        status: 'success',
        roomsInfo: action.payload,
      }))
      .addCase(fetchRoomsDetails.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }));
  },
});

export const { selectedRoom, addRoom, deleteRoomReducer } = roomsSlice.actions;
export default roomsSlice.reducer;
