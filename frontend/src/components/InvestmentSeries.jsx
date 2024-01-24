// src/components/InvestmentSeries.jsx
import React from 'react';
import { Typography } from '@mui/material';
import CirclePacking from './CirclePacking'; // Adjust the import path as needed

const formatCurrencyWithAbbreviation = (amount) => {
    if (!amount) return "$0";
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(2)}B`;
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(2)}M`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

const InvestmentSeries = ({ seriesName, investorName, totalInvestmentsByType }) => {
    const formattedSeriesName = seriesName.charAt(0).toUpperCase() + seriesName.slice(1, -1) + seriesName.slice(-1).toUpperCase();
    const investment = totalInvestmentsByType[seriesName.toLowerCase()];
    const scalingRatio = investment / totalInvestmentsByType["total"];

    if (scalingRatio < 0.05) {
        return null;
    }

    return (
        <div style={{ height: "280px", width: "280px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                {formattedSeriesName.replace(/_/g, ' ')}
            </Typography>
            <Typography variant="subtitle2" align="center" style={{ fontSize: "16px" }}>
                Total investment: {formatCurrencyWithAbbreviation(investment)}
            </Typography>
            <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CirclePacking
                    investorCrunchbasePath={`${investorName}?series=${seriesName.toLowerCase()}`}
                    scalingRatio={scalingRatio}
                />
            </div>
        </div>
    );
};

export default InvestmentSeries;