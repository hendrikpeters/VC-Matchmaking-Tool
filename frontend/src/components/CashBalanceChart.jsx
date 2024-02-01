import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { format } from "d3-format";

const CashBalanceChart = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/cashBalance`)
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.map((item) => ({
          ...item,
          color: `#${item.color}`,
          data: item.data.map((d) => ({ ...d, y: parseFloat(d.y) })),
        }));
        setData(processedData);
      })
      .catch((error) =>
        console.error("Error fetching cash balance data:", error)
      );
  }, []);

  const formatYValueToMillions = (value) => {
    if (Math.abs(value) >= 1e9) {
      return `${format(".1f")(value / 1e9)}B`; // Format as XX.XB (Billion)
    } else {
      return `${format(".1f")(value / 1e6)}M`; // Format as XX.XM (Million)
    }
  };

  const formatYValueToMillions_Axis_Label = (value) => {
    if (Math.abs(value) >= 1e9) {
      return `${format(".0f")(value / 1e9)}B`; // Format as XXB (Billion)
    } else {
      return `${format(".0f")(value / 1e6)}M`; // Format as XXM (Million)
    }
  };

  return (
    <ResponsiveLine
      curve="linear"
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
      data={data}
      margin={{ top: 20, right: 30, bottom: 38, left: 55 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
        tickValues: 5, // Set the number of desired tick values
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
        legendOffset: 32,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Working Capital (USD)",
        legendOffset: -48,
        legendPosition: "middle",
        format: formatYValueToMillions_Axis_Label, // Use the custom format function for axisLeft
      }}
      colors={{ datum: "color" }}
      enablePoints={true}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      enableArea={false}
      useMesh={true}
      enableGridX={false}
      enableGridY={false}
    />
  );
};

export default CashBalanceChart;
