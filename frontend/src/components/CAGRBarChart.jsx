import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const CAGRBarChart = ({ isDashboard = false }) => {
  const [cagrData, setCagrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/cagr`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedData = data.map(item => ({
          startup_name: item.startup_name,
          CAGR: item.cagr,
          color: item.color
        }));

        setCagrData(formattedData);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ResponsiveBar
      data={cagrData}
      keys={["CAGR"]}
      indexBy="startup_name"
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
      margin={{ top: 20, right: 30, bottom: 38, left: 55 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(bar) => `#${bar.data.color}`}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      enableGridX={false}
      enableGridY={false}
      axisTop={null}
      axisBottom={{
        tickRotation: 12,
        tickPadding: 8,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Revenue CAGR (%)",
        legendPosition: "middle",
        legendOffset: -48,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      markers={[{
        axis: 'y',
        value: 0,
        lineStyle: {
          stroke: colors.grey[100],
          strokeWidth: 2
        },
        legendOrientation: 'vertical'
      }]}
      role="application"
      barAriaLabel={(e) => {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default CAGRBarChart;
