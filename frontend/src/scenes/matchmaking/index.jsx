import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Matchmaking = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/investors") // Ensure correct URL
      .then((response) => response.json())
      .then((data) => {
        // Map data to include 'id' field
        const mappedData = data.map((item) => ({
          ...item,
          id: item.investor_id,
        }));
        setInvestors(mappedData);
      })
      .catch((error) => console.error("Error fetching investors:", error));
  }, []);

  const columns = [
    { field: "investor_name", headerName: "Investor Name", flex: 2 },
    { field: "headquater_city", headerName: "Headquarter City", flex: 2 },
    { field: "headquater_countrycode", headerName: "Country Code", flex: 1 },
    // ...additional columns as needed
  ];

  return (
    <Box m="20px">
      <Header title="Matchmaking" subtitle="Find the perfect investor" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "1rem", // Increase the font size of the cell text
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "1.3rem", // Font size for column headers
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={investors}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Matchmaking;
