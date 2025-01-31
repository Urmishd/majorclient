import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 0,
  formData: {
    sellerName: '',
    mobileNo: '',
    email: '',
    accountNo: '',
    confirmAccountNo: '',
    ifscCode: '',
    state: '',
    city: '',
    pincode: '',
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    nextStep: (state) => {
      if (state.step < 2) {
        state.step += 1;
      }
    },
    previousStep: (state) => {
      if (state.step > 0) {
        state.step -= 1;
      }
    },
    resetForm: () => initialState,
  },
});

export const { updateFormData, nextStep, previousStep, resetForm } = formSlice.actions;
export default formSlice.reducer;
