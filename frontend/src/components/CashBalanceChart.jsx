import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { format } from 'd3-format';

const CashBalanceChart = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/cashBalance`)
            .then(response => response.json())
            .then(data => {
                const processedData = data.map(item => ({
                    ...item,
                    color: `#${item.color}`,
                    data: item.data.map(d => ({ ...d, y: parseFloat(d.y) }))
                }));
                setData(processedData);
            })
            .catch(error => console.error('Error fetching cash balance data:', error));
    }, []);

    const formatYValueToMillions = value => {
        return `${format(".3s")(value).replace('G', 'B')}`; // G for Giga (Billion), B for Billion
      };

    const formatYValueToMillions_Axis_Label = value => {
    return `${format(".1s")(value).replace('G', ' Billion')}`; // G for Giga (Billion), B for Billion
    };

    return (
        <div style={{ height: 400 }}>
            <ResponsiveLine
                curve='linear'
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
                margin={{ top: 20, right: 25, bottom: 160, left: 70 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                yFormat={formatYValueToMillions} // Apply the custom format
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Year',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cash Balance',
                    legendOffset: -50,
                    legendPosition: 'middle',
                    format: formatYValueToMillions_Axis_Label, // Use the custom format function for axisLeft
                }}
                colors={{ datum: 'color' }}
                enablePoints={true}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea={false}
                useMesh={false}
                enableGridX={false}
                enableGridY={false}
                /* legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]} */
            />
        </div>
    );
};

export default CashBalanceChart;
