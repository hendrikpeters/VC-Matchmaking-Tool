import React, { useState, useEffect } from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CirclePacking = ({ investorCrunchbasePath, scalingRatio }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (investorCrunchbasePath) {
      fetch(`http://localhost:5000/investments/${investorCrunchbasePath}`)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [investorCrunchbasePath]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Custom Tooltip with formatted value
  const CustomTooltip = ({ id, value }) => {
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0, // Adjust number of decimal places if needed
    }).format(value);

    return (
      <div
        style={{
          color: colors.grey[100],
          background: `${colors.grey[900]}CC`, // CC for 80% opacity
          paddingLeft: "10px",
          paddingRight: "10px",
          borderRadius: "4px",
          fontSize: "25px",
        }}
      >
        <strong>{id}</strong>: {formattedValue}
      </div>
    );
  };

  const circleColor =
    theme.palette.mode === "dark"
      ? colors.greenAccent[500]
      : colors.blueAccent[500];

  return (
    <div style={{ height: `${scalingRatio*800}px`, width: `${scalingRatio*800}px` }}>
        <ResponsiveCirclePacking
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          id="name"
          value="loc"
          colors={circleColor}
          childColor={colors.greenAccent[400]}
          leavesOnly={true}
          padding={4}
          labelsSkipRadius={10}
          tooltip={({ id, value }) => <CustomTooltip id={id} value={value} />}
        />
    </div>
  );
};

export default CirclePacking;