import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import InvestorDialog from "../../components/InvestorDialog";

const Matchmaking = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [investors, setInvestors] = useState([]);
  const [totalInvestmentsByType, setTotalInvestmentsByType] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState({});

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/investors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedData = data.map((item, index) => {
        let targetIndustries = "";
        try {
          if (item.target_industries) {
            targetIndustries = JSON.parse(item.target_industries).join(", ");
          }
        } catch (e) {
          console.error("Error parsing target_industries:", e);
        }
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
          investor_type: investorType,
        };
      });
      setInvestors(mappedData);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  const fetchTotalInvestmentsByType = async (investorName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/investments/${investorName}/total/byType`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalInvestmentsByType(data);
    } catch (error) {
      console.error(
        `Error fetching total investments by type for ${investorName}:`,
        error
      );
    }
  };

  const handleRowClick = (investor) => {
    setSelectedInvestor(investor);
    fetchTotalInvestmentsByType(investor.investor_name);
    setDialogOpen(true);
  };

  const columns = [
    {
      field: "investor_name",
      headerName: "Investor Name",
      flex: 1.5,
      renderCell: (params) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleRowClick(params.row);
          }}
          style={{ color: "white", textDecoration: "none" }}
        >
          {params.value}
        </a>
      ),
    },
    { field: "headquater_city", headerName: "City", flex: 0.75 },
    { field: "headquater_country", headerName: "Country", flex: 0.75 },
    {
      field: "num_employees",
      headerName: "Employees",
      type: "number",
      flex: 0.85,
    },
    { field: "num_exits", headerName: "Exits", type: "number", flex: 0.6 },
    {
      field: "num_investments",
      headerName: "Investments",
      type: "number",
      flex: 0.9,
    },
    {
      field: "num_lead_investments",
      headerName: "Lead Investments",
      type: "number",
      flex: 1.1,
    },
    { field: "target_industries", headerName: "Target Industries", flex: 1.5 },
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
            fontSize: "1rem",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "1.3rem",
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
          onRowClick={(param) => handleRowClick(param.row)}
        />
      </Box>
      {dialogOpen && (
        <InvestorDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          investor={selectedInvestor}
          totalInvestments={totalInvestmentsByType["total"]}
          totalInvestmentsByType={totalInvestmentsByType}
        />
      )}
    </Box>
  );
};

export default Matchmaking;