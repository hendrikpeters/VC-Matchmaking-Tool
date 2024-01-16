import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { format } from 'd3-format';


const StartupRevenueChart = ({ startupId, crunchbasePath }) => {

  const [news, setNews] = useState([]);  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (startupId) {
      setLoading(true);
      fetch(`http://localhost:5000/revenues/${startupId}`)
        .then((response) => response.json())
        .then((revenueData) => {
          // No need to apply color here as it is included in the response
          setData([revenueData]);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
    if (crunchbasePath) {
        fetch(`http://localhost:5000/news/${crunchbasePath}`)
          .then((response
  ) => response.json())
  .then((newsData) => {
  setNews(newsData);
  })
  .catch((err) => {
  console.error('Error fetching news:', err);
  });
  }
  }, [startupId, crunchbasePath]);

  // Custom format function to display y-axis values in millions
  const formatYValueToMillions = (value) => {
    return `${format(".3s")(value).replace("G", " B")}`; // G for Giga (Billion), B for Billion
  };

  const formatYValueToMillions_Axis_Label = (value) => {
    return `${format(".1s")(value).replace("G", " Billion")}`; // G for Giga (Billion), B for Billion
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No revenue data available</div>;
  }

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 55, bottom: 40, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "0",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat={formatYValueToMillions} // Apply the custom format
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Year",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Revenue",
        legendOffset: -64,
        legendPosition: "middle",
        format: formatYValueToMillions_Axis_Label, // Use the custom format function for axisLeft
      }}
      enableGridX={false}
      enableGridY={false}

      colors={(line) => line.color || colors.primary[500]}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
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
    />
  );
};

export default StartupRevenueChart;
