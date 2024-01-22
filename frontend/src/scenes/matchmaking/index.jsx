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
    fetch("http://localhost:5000/investors")
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item, index) => {
          // Check and parse 'target_industries' if it's a valid JSON string
          let targetIndustries = "";
          try {
            if (item.target_industries) {
              targetIndustries = JSON.parse(item.target_industries).join(", ");
            }
          } catch (e) {
            console.error("Error parsing target_industries:", e);
          }
  
          // Check and parse 'investor_type' if it's a valid JSON string
          let investorType = "";
          try {
            if (item.investor_type) {
              investorType = JSON.parse(item.investor_type).join(", ");
            }
          } catch (e) {
            console.error("Error parsing investor_type:", e);
          }
  
          return {
            ...item,
            id: item.investor_id || index,
            target_industries: targetIndustries,
            investor_type: investorType
          };
        });
  
        setInvestors(mappedData);
      })
      .catch((error) => console.error("Error fetching investors:", error));
  }, []);
  
  const columns = [
    { field: "investor_name", headerName: "Investor Name", flex: 1.5 },
    { field: "headquater_city", headerName: "City", flex: .75 },
    { field: "headquater_country", headerName: "Country", flex: .75 },
    { field: "num_employees", headerName: "Employees", type: 'number', flex: .85 },
    { field: "num_exits", headerName: "Exits", type: 'number', flex: .6 },
    { field: "num_investments", headerName: "Investments", type: 'number', flex: .9 },
    { field: "num_lead_investments", headerName: "Lead Investments", type: 'number', flex: 1.1 },
    { field: "target_industries", headerName: "Target Industries", flex: 1.5 },
    /* { field: "investor_type", headerName: "Investor Type", flex: 1.5 } */
    // Add additional columns as needed
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
