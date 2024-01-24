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

const formatCurrencyWithAbbreviation = (amount) => {
  if (!amount) return "$0";
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(2)}B`;
  } else if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(2)}M`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
};

const InvestorDialog = ({
  open,
  onClose,
  investor,
  totalInvestmentsByType,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define the style for the typography elements
  const detailTextStyle = {
    fontSize: "18px", // Adjust the font size as needed
    marginBottom: "2px", // Spacing between each detail
  };
  console.log(totalInvestmentsByType["total"]);
  console.log(
    totalInvestmentsByType["series_a"] / totalInvestmentsByType["total"]
  );

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
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series A
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_a"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_a"
                }
                scalingRatio={
                  totalInvestmentsByType["series_a"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series B
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_b"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_b"
                }
                scalingRatio={
                  totalInvestmentsByType["series_b"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series C
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_c"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_c"
                }
                scalingRatio={
                  totalInvestmentsByType["series_c"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series D
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_d"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_d"
                }
                scalingRatio={
                  totalInvestmentsByType["series_d"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series E
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_e"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_e"
                }
                scalingRatio={
                  totalInvestmentsByType["series_e"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series F
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_f"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_f"
                }
                scalingRatio={
                  totalInvestmentsByType["series_f"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series G
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_g"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_g"
                }
                scalingRatio={
                  totalInvestmentsByType["series_g"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series H
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_h"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_h"
                }
                scalingRatio={
                  totalInvestmentsByType["series_h"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series I
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_i"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_i"
                }
                scalingRatio={
                  totalInvestmentsByType["series_i"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
          </div>
          <div
            style={{
              height: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              align="center"
              style={{ fontSize: "26px" }}
            >
              Series J
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              style={{ fontSize: "16px" }}
            >
              Total investment:{" "}
              {formatCurrencyWithAbbreviation(
                totalInvestmentsByType["series_j"]
              )}{" "}
            </Typography>
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CirclePacking
                investorCrunchbasePath={
                  investor.investor_name + "?series=series_j"
                }
                scalingRatio={
                  totalInvestmentsByType["series_j"] /
                  totalInvestmentsByType["total"]
                }
              />
            </div>
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
  const [totalInvestments, setTotalInvestments] = useState({});
  const [totalInvestmentsByType, setTotalInvestmentsByType] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState({});

  useEffect(() => {
    fetchInvestors();
    fetchTotalInvestments();
    fetchTotalInvestmentsByType();
  }, []);

  const fetchInvestors = () => {
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
  };

  const fetchTotalInvestments = async () => {
    try {
      const response = await fetch("http://localhost:5000/investments/total");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const investments = data.reduce((acc, curr) => {
        acc[curr.investor_name] = curr.total_investment;
        return acc;
      }, {});
      setTotalInvestments(investments);
    } catch (error) {
      console.error("Error fetching total investments:", error);
    }
  };

  const fetchTotalInvestmentsByType = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/investments/total/byType"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalInvestmentsByType(data); // data is already an object with investment types as keys
    } catch (error) {
      console.error("Error fetching total investments by type:", error);
    }
  };

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
          onRowClick={(param) => handleRowClick(param.row)}
        />
      </Box>
      {dialogOpen && (
        <InvestorDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          investor={selectedInvestor}
          totalInvestments={totalInvestments}
          totalInvestmentsByType={totalInvestmentsByType}
        />
      )}
    </Box>
  );
};

export default Matchmaking;
