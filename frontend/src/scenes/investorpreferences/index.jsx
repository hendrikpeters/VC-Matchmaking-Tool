import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, useTheme, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const InvestorPreferences = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Initial state with all the preference settings
  const [preferences, setPreferences] = useState({
    revenueRange: '',
    netIncome: '',
    cashOnHand: '',
    burnRate: '',
    investmentPeriodStart: null,
    investmentPeriodEnd: null,
    isSeriesAInvestor: false,
  });

  const handleInputChange = (event) => {
    setPreferences({ ...preferences, [event.target.name]: event.target.value });
  };

  const handleDateChange = (value, field) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const handleToggleChange = (event, newAlignment) => {
    setPreferences({ ...preferences, isSeriesAInvestor: newAlignment === 'yes' });
  };

  const applyPreferences = () => {
    console.log('Applying preferences:', preferences);
    // Logic to apply these preferences
  };

  return (
    <Box m="20px">
      <Header title="Investor Preferences" subtitle="Customize your investment criteria" />

      <Box sx={{ p: 2, backgroundColor: colors.primary[400], borderRadius: '10px' }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Revenue Range</InputLabel>
            <Select
              name="revenueRange"
              value={preferences.revenueRange}
              label="Revenue Range"
              onChange={handleInputChange}
            >
              <MenuItem value="500k-1m">500k - 1M</MenuItem>
              <MenuItem value="1m-5m">1M - 5M</MenuItem>
              <MenuItem value="5m-10m">5M - 10M</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          label="Net Income"
          name="netIncome"
          type="number"
          fullWidth
          sx={{ mb: 3 }}
          value={preferences.netIncome}
          onChange={handleInputChange}
        />

        <TextField
          label="Cash on Hand"
          name="cashOnHand"
          type="number"
          fullWidth
          sx={{ mb: 3 }}
          value={preferences.cashOnHand}
          onChange={handleInputChange}
        />

        <TextField
          label="Maximum Burn Rate"
          name="burnRate"
          type="number"
          fullWidth
          sx={{ mb: 3 }}
          value={preferences.burnRate}
          onChange={handleInputChange}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <DatePicker
              label="Investment Period Start"
              value={preferences.investmentPeriodStart}
              onChange={(newValue) => handleDateChange(newValue, 'investmentPeriodStart')}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Investment Period End"
              value={preferences.investmentPeriodEnd}
              onChange={(newValue) => handleDateChange(newValue, 'investmentPeriodEnd')}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Interested in Series A Investments?
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={preferences.isSeriesAInvestor ? 'yes' : 'no'}
            exclusive
            onChange={handleToggleChange}
          >
            <ToggleButton value="yes">Yes</ToggleButton>
            <ToggleButton value="no">No</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={applyPreferences}
            sx={{
              backgroundColor: colors.greenAccent[700],
              '&:hover': { backgroundColor: colors.greenAccent[800] },
            }}
          >
            Apply Preferences
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvestorPreferences;
