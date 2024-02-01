import React, { useState, useEffect } from 'react';
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Custom Tooltip Component
  const CustomTooltip = ({ id, value }) => (
    <div style={{ color: 'black', background: 'white', padding: '5px', borderRadius: '4px' }}>
      <strong>{id}:</strong> {value}
    </div>
  );

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/startups`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((startups) => {
        // Process the data to aggregate startups by industry
        const industryCounts = startups.reduce((acc, { industry }) => {
          acc[industry] = (acc[industry] || 0) + 1;
          return acc;
        }, {});

        // Format the data for the pie chart
        const formattedData = Object.keys(industryCounts).map(industry => ({
          id: industry,
          label: industry,
          value: industryCounts[industry],
        }));

        setData(formattedData);  // Set the formatted data for the pie chart
        setLoading(false);       // Set loading to false
      })
      .catch((error) => {
        setError(error.message);  // Handle any error
        setLoading(false);        // Set loading to false
      });
  }, []);

  if (loading) {
    return <div></div>;  // Render loading state
  }

  if (error) {
    return <div>Error: {error}</div>;  // Render error state
  }

  return (
    <ResponsivePie
      data={data}  // Use the real pie data here
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 20, right: 20, bottom: 25, left: 20 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.1}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      tooltip={({ datum }) => <CustomTooltip id={datum.id} value={datum.value} />}
      // ... other props
    />
  );
};

export default PieChart;
