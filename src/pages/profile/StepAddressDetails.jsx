import { Box, Grid, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PropTypes from 'prop-types';

const AddressDetails = ({ formData, states, cities, loading, error, handleChange }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Address Details
    </Typography>
    {loading && <Typography color="primary">Loading states...</Typography>}
    {error && <Typography color="error">Error: {error}</Typography>}
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1 || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth required>
          <InputLabel>State</InputLabel>
          <Select name="state" value={formData.state || ''} onChange={handleChange}>
            <MenuItem value="">Select State</MenuItem>
            {states.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth required>
          <InputLabel>City</InputLabel>
          <Select
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            disabled={!formData.state}
          >
            <MenuItem value="">Select City</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Pin Code"
          name="pinCode"
          value={formData.pinCode || ''}
          onChange={handleChange}
          required
        />
      </Grid>
    </Grid>
  </Box>
);

AddressDetails.propTypes = {
  formData: PropTypes.shape({
    addressLine1: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    pinCode: PropTypes.string
  }).isRequired,
  states: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })).isRequired,
  cities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

export default AddressDetails;
