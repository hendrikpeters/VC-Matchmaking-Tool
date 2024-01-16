import { ResponsiveSunburst } from '@nivo/sunburst'
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockPieData as data } from "../data/mockData";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const SuburstPieChart = ({ data /* see data tab */ }) => {
    return (
    <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="loc"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{ theme: 'background' }}
        enableArcLabels={true}
        arcLabelsSkipAngle={11}
        arcLabelsTextColor={{ theme: 'background' }}
        animate={false}
    />
    ) 
}
export default SuburstPieChart;


/* const SuburstPieChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <ResponsiveSunburst
        data={data}
        theme={{
          // added
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
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="loc"
            cornerRadius={2}
            borderColor={{ theme: 'background' }}
            colors={{ scheme: 'nivo' }}
            childColor={{
                from: 'color',
                modifiers: [
                    [
                        'brighter',
                        '0.1'
                    ]
                ]
            }}
            enableArcLabels={true}
            arcLabelsSkipAngle={11}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.4
                    ]
                ]
            }}
            animate={false}
        />
    );
};
 */
/* export default SuburstPieChart; */