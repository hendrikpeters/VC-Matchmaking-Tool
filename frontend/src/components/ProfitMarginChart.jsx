import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import CustomTooltip from "./CustomToolTip";

const ProfitMarginChart = () => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [colorsMap, setColorsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profitMargins`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((rawData) => {
        const transformedData = Object.entries(rawData).map(([year, companies]) => {
          const dataEntry = { year };
          Object.entries(companies).forEach(([company, { profitMargin, color }]) => {
            dataEntry[company] = profitMargin;
            colorsMap[company] = color; // Update colors map
          });
          return dataEntry;
        });

        const startupNames = Object.keys(rawData[Object.keys(rawData)[0]]);

        setKeys(startupNames); 
        setData(transformedData); 
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="year"
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
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(bar) => colorsMap[bar.id]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      yScale={{
        type: "symlog",
        max: "auto",
      }}
      enableGridX={false}
      enableGridY={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Year",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Profit Margin (%)",
        legendPosition: "middle",
        legendOffset: -48,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
      tooltip={({ id, value, color, indexValue }) => (
        <CustomTooltip id={id} indexValue={indexValue} value={value} color={color} formatType={"percentage"} />
      )}
    />
  );
};

export default ProfitMarginChart;

function generateColorsMap(data) {
    // Mock function, replace with actual logic
    const colorsMap = {};
    data.forEach(item => {
      colorsMap[item.name] = item.color;
    });
    return colorsMap;
  }