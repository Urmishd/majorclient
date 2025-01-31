import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStates = createAsyncThunk('profile/fetchStates', async () => {
  const response = await fetch('http://192.168.1.7:5161/states/GetAll');
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  const data = await response.json();
  return data;
});

export const fetchCities = createAsyncThunk('profile/fetchCities', async (stateId) => {
  const response = await fetch(`http://192.168.1.7:5161/cities/GetAll?stateId=${stateId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }
  const data = await response.json();
  return data;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pinCode: '',
      country: '',
    },
    states: [],
    cities: [],
    loading: false,
    error: null,
  },
  reducers: {
    handleInputChange: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;

      if (name === 'state') {
        state.formData.city = ''; 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { handleInputChange } = profileSlice.actions;
export default profileSlice.reducer;
