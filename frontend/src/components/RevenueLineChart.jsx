import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { format } from 'd3-format';

const RevenueLineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/revenues`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(process.env.REACT_APP_API_URL);
        return response.json();
      })
      .then(financialData => {
        const startupsRevenue = financialData.reduce((acc, { startup_name, year, revenue, color }) => {
          if (!acc[startup_name]) {
            acc[startup_name] = {
              id: startup_name,
              data: [],
              color: `${color}` // Ensure the color is a valid CSS hex color
            };
          }
          acc[startup_name].data.push({ x: year.toString(), y: revenue });
          return acc;
        }, {});
  
        const formattedData = Object.values(startupsRevenue);
        console.log(formattedData); // Log to check the data structure
        setLineData(formattedData);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  
    // Custom format function to display y-axis values in millions
    const formatYValueToMillions = value => {
        if (Math.abs(value) >= 1e9) {
            return `${format(".1f")(value / 1e9)}B`; // Format as XX.XB (Billion)
        } else {
            return `${format(".1f")(value / 1e6)}M`; // Format as XX.XM (Million)
        }
    };
    
    const formatYValueToMillions_Axis_Label = value => {
        if (Math.abs(value) >= 1e9) {
            return `${format(".0f")(value / 1e9)}B`; // Format as XXB (Billion)
        } else {
            return `${format(".0f")(value / 1e6)}M`; // Format as XXM (Million)
        }
    };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ResponsiveLine
      data={lineData}
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
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={(line) => line.color}
            margin={{ top: 35, right: 125, bottom: 38, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "5000000",
        max: "auto",
      }}
      yFormat={formatYValueToMillions} // Apply the custom format
      curve="linear"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Year", // added
        legendOffset: 25,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Revenue (USD)", // added
        legendOffset: -50,
        legendPosition: "middle",
        format: formatYValueToMillions_Axis_Label, // Use the custom format function for axisLeft
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 10,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 22,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default RevenueLineChart;