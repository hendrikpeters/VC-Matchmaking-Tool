import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CirclePacking from "../../components/CirclePacking";

const InvestorDialog = ({ open, onClose, investor }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define the style for the typography elements
  const detailTextStyle = {
    fontSize: "18px", // Adjust the font size as needed
    marginBottom: "2px", // Spacing between each detail
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          width: "80%", // Adjust width as needed
          height: "80%", // Adjust height as needed
        },
      }}
      fullWidth={true} // Ensures dialog is responsive
    maxWidth="xxl" // Adjusts the maximum width to extra large
    maxHeight="xxl" // Adjusts the maximum height to extra large
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "40px" }}>
        {investor.investor_name}
      </DialogTitle>
    <DialogContent dividers>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series A
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_a"}
                    title="Series A"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series B
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_b"}
                    title="Series B"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series C
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_c"}
                    title="Series C"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series D
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_d"}
                    title="Series D"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series E
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_e"}
                    title="Series E"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series F
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_f"}
                    title="Series F"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series G
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_g"}
                    title="Series G"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series H
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_h"}
                    title="Series H"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series I
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_i"}
                    title="Series I"
                />
            </div>
            <div>
                <Typography variant="subtitle1" align="center" style={{ fontSize: "26px" }}>
                    Series J
                </Typography>
                <CirclePacking
                    investorCrunchbasePath={investor.investor_name + "?series=series_j"}
                    title="Series J"
                />
            </div>
        </Box>
        <Box>
            <Typography
                variant="h6"
                sx={{ fontWeight: 500, marginBottom: "20px", fontSize: "24px" }}
            >
                Details
            </Typography>
            <Typography sx={detailTextStyle}>
                City: {investor.headquater_city}
            </Typography>
            <Typography sx={detailTextStyle}>
                Country: {investor.headquater_country}
            </Typography>
            <Typography sx={detailTextStyle}>
                Employees: {investor.num_employees}
            </Typography>
            <Typography sx={detailTextStyle}>
                Exits: {investor.num_exits}
            </Typography>
            <Typography sx={detailTextStyle}>
                Investments: {investor.num_investments}
            </Typography>
            <Typography sx={detailTextStyle}>
                Lead Investments: {investor.num_lead_investments}
            </Typography>
            <Typography sx={detailTextStyle}>
                Target Industries: {investor.target_industries}
            </Typography>
            {/* Add more fields as needed */}
        </Box>
    </DialogContent>
    <DialogActions>
        <Button
          onClick={() => {
            /* logic to handle match */
          }}
          sx={{
            backgroundColor: colors.greenAccent[700],
            "&:hover": { backgroundColor: colors.greenAccent[800] },
            color: "white",
            fontSize: "25px", // Increased font size
            padding: "10px 30px", // Larger button
          }}
        >
          Match
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const Matchmaking = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [investors, setInvestors] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState({});

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
            investor_type: investorType,
          };
        });

        setInvestors(mappedData);
      })
      .catch((error) => console.error("Error fetching investors:", error));
  }, []);

  const handleRowClick = (investor) => {
    setSelectedInvestor(investor);
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
            e.preventDefault(); // Prevent default link behavior
            handleRowClick(params.row);
          }}
          style={{ color: "white", textDecoration: "none" }} // Styles for the link
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
    /* { field: "investor_type", headerName: "Investor Type", flex: 1.5 } */
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
      <InvestorDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        investor={selectedInvestor}
      />
    </Box>
  );
};

export default Matchmaking;
