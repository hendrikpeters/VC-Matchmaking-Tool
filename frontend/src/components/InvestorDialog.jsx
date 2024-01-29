import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import InvestmentSeries from "../components/InvestmentSeries";
import { tokens } from "../theme";

const InvestorDialog = ({
  open,
  onClose,
  investor,
  totalInvestmentsByType,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [investmentTypes, setInvestmentTypes] = useState([]);

  const fetchInvestmentTypesForInvestor = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/investments/${investor.investor_name}/types`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInvestmentTypes(data);
    } catch (error) {
      console.error("Error fetching investment types for investor:", error);
    }
  };

  useEffect(() => {
    fetchInvestmentTypesForInvestor();
  }, [investor.investor_name]);

  // Assuming you have a function to format the detail text appropriately
  const formatDetailText = (text) => {
    return text;
  };

  const DetailCard = ({ label, value }) => (
    <Card sx={{ bgcolor: colors.primary[500]}}>
      <CardContent>
        <Typography variant="subtitle1" sx={{  fontSize: "20px", mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{fontWeight: "bold",fontSize: "30px"}}>{formatDetailText(value)}</Typography>
      </CardContent>
    </Card>
  );

  const details = [
    { label: "City", value: investor.headquater_city },
    { label: "Country", value: investor.headquater_country },
    { label: "Employees", value: investor.num_employees },
    { label: "Exits", value: investor.num_exits },
    { label: "Investments", value: investor.num_investments },
    { label: "Lead Investments", value: investor.num_lead_investments }
];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={false}
      maxWidth="xxl"
      align="center"
      PaperProps={{
        style: {
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          height: "auto", // Adjusted for content height
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "40px" }}>
        {investor.investor_name}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {investmentTypes.map((type) => (
            <InvestmentSeries
              key={type}
              seriesName={type}
              investorName={investor.investor_name}
              totalInvestmentsByType={totalInvestmentsByType}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "grid",
            maxWidth: "700px",
            gridTemplateColumns: "repeat(3, 1fr)", // Four items per row
            gap: 1.5,
            mb: 2, // Add some margin at the bottom for spacing
          }}
        >
          {details.slice(0, 3).map((detail) => ( // First row
            <DetailCard
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "grid",
            maxWidth: "700px",
            gridTemplateColumns: "repeat(3, 1fr)", // Four items per row
            gap: 1.5,
          }}
        >
          {details.slice(3).map((detail) => ( // Second row
            <DetailCard
              key={detail.label}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose} // Changed to use onClose
          sx={{
            backgroundColor: colors.greenAccent[700],
            "&:hover": { backgroundColor: colors.greenAccent[800] },
            color: "white",
            fontSize: "25px",
            padding: "10px 30px",
          }}
        >
          Match
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestorDialog;
