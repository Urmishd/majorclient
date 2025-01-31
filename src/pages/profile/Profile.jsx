import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Stepper, Step, StepLabel, Box } from '@mui/material';
import { fetchStates, fetchCities, handleInputChange } from '../../redux/profileSlice';
import PersonalDetails from '../profile/StepPersonalDetails';
import BankDetails from '../profile/StepBankDetails';
import AddressDetails from '../profile/StepAddressDetails';

const steps = [
  'Seller Personal Details',
  'Seller Bank Details',
  'Seller Address Details',
];

const Profile = () => {
  const dispatch = useDispatch();
  const { formData, states, cities, loading, error } = useSelector((state) => state.profile);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (formData.state) {
      dispatch(fetchCities(formData.state));
    }
  }, [formData.state, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleInputChange({ name, value }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Registration Submitted Successfully!');
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalDetails formData={formData} handleChange={handleChange} />;
      case 1:
        return <BankDetails formData={formData} handleChange={handleChange} />;
      case 2:
        return (
          <AddressDetails
            formData={formData}
            states={states}
            cities={cities}
            loading={loading}
            error={error}
            handleChange={handleChange}
          />
        );
      default:
        return 'Unknown Step';
    }
  };

  return (
    <Container maxWidth="md">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4">
        {renderStep()}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" color="primary">
              Submit Registration
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default Profile;
