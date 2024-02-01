import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import RevenueLineChart from "../../components/RevenueLineChart";
import PieChart from "../../components/PieChart";
import { useState, useEffect } from "react";
import CAGRBarChart from "../../components/CAGRBarChart";
import ProfitMarginChart from "../../components/ProfitMarginChart";
import CashBalanceChart from "../../components/CashBalanceChart";

const InvestorDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [datasets, setDatasets] = useState({}); // Store datasets in an object
  const [loading, setLoading] = useState({}); // Loading state for each dataset
  const [error, setError] = useState({}); // Error state for each dataset

  // An array of dataset URLs or identifiers
  const datasetUrls = [
    `${process.env.REACT_APP_API_URL}/startups`,
    //"http://localhost:5000/companies",
    // Add more dataset URLs or identifiers as needed
  ];

  useEffect(() => {
    // Initialize loading state for each dataset
    setLoading(datasetUrls.reduce((acc, url) => ({ ...acc, [url]: true }), {}));

    datasetUrls.forEach((url) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setDatasets((prevDatasets) => ({ ...prevDatasets, [url]: data }));
          setLoading((prevLoading) => ({ ...prevLoading, [url]: false }));
        })
        .catch((err) => {
          console.error(err);
          setError((prevError) => ({ ...prevError, [url]: err }));
          setLoading((prevLoading) => ({ ...prevLoading, [url]: false }));
        });
    });
  }, []); // Empty array means this effect will only run once on mount

  // Now you can access the data for each dataset using `datasets[url]`
  // Check if data is loading with `loading[url]`
  // And check if there was an error with `error[url]`

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Match Performances"
          subtitle="Get insights on key metrics of your matches"
        />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="0px"
            p="10px 15px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h2"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Annual Revenue
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <RevenueLineChart />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          p="10px 15px"
        >
          <Typography variant="h3" fontWeight="600">
            Revenue CAGR
          </Typography>
          <Box height="250px">
            <CAGRBarChart />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="10px 15px"
          overflow="auto"
        >
          <Typography variant="h3" fontWeight="600">
            Industries
          </Typography>
          <Box
            display="flex"
            height="240px"
            flexDirection="column"
            alignItems="center"
            mt="0px"
          >
            <PieChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="10px 15px"
          overflow="auto"
        >
         <Typography variant="h3" fontWeight="600">
            Profit Margin
          </Typography>   
          <Box height="250px">
          <ProfitMarginChart />
          </Box>

        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="10px 15px"
          overflow="auto"
        >
         <Typography variant="h3" fontWeight="600">
            Cash Balance
          </Typography>   
          <Box height="250px">
          <CashBalanceChart/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InvestorDashboard;
