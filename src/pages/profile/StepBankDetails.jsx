import { Box, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const BankDetails = ({ formData, handleChange }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Bank Details
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Bank Name"
          name="bankName"
          value={formData.bankName || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="IFSC Code"
          name="ifscCode"
          value={formData.ifscCode || ''}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Branch Name"
          name="branchName"
          value={formData.branchName || ''}
          onChange={handleChange}
          required
        />
      </Grid>
    </Grid>
  </Box>
);

BankDetails.propTypes = {
  formData: PropTypes.shape({
    bankName: PropTypes.string,
    accountNumber: PropTypes.string,
    ifscCode: PropTypes.string,
    branchName: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired
};

export default BankDetails;
