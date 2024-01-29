import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Card, CardContent } from "@mui/material";

const InvestorInfoWidget = ({ investor, bgcolor }) => {
    return (
        <Card sx={{ marginBottom: 2, backgroundImage: "none", bgcolor: bgcolor }}>
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: ".75rem" }}>
                    Investor Information
                </Typography>
                <Typography>
                    Headquarters: {investor?.headquater_city},{" "}
                    {investor?.headquater_countrycode}
                </Typography>
                {/* You can add more investor information here if needed */}
            </CardContent>
        </Card>
    );
};

const FounderMatches = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [investors, setInvestors] = useState([]);
    const industryFontSize = "0.95rem";

    const [selectedInvestor, setSelectedInvestor] = useState(null);

    useEffect(() => {
        // Fetching all investors
        fetch(`${process.env.REACT_APP_API_URL}/investors/matches`)
            .then((response) => response.json())
            .then((investorData) => {
                setInvestors(investorData);
            })
            .catch((error) => console.error("Error fetching investors:", error));
    }, []);

    const handleInvestorClick = (investor) => {
        setSelectedInvestor(investor);
    };

    return (
        <Box display="flex" m="20px">
            <Box flexGrow={1}>
                <Header title="Your matches" subtitle="Check out your latest matches" />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    m={2}
                >
                    <Card
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            bgcolor: colors.primary[400],
                            backgroundImage: "none",
                            borderRadius: "16px",
                        }}
                    >
                        <Box display="flex" pt={1} pb={1}>
                            <Box flex={1} pr={2}>
                                <List
                                    sx={{
                                        width: "100%",
                                        ".MuiListItem-root": {
                                            paddingTop: theme.spacing(1.5),
                                            paddingBottom: theme.spacing(1.5),
                                        },
                                        ".MuiListItemText-primary": {
                                            fontSize: "1.1rem",
                                        },
                                        ".MuiListItemText-secondary": {
                                            fontSize: industryFontSize,
                                        },
                                        ".MuiDivider-root:last-child": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    {investors.map((investor) => (
                                        <React.Fragment key={investor.investor_id}>
                                            <ListItem
                                                alignItems="flex-start"
                                                button
                                                onClick={() => handleInvestorClick(investor)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={investor.investor_name}
                                                        src={
                                                            investor.logo_path ||
                                                            "../../assets/default_logo.jpg"
                                                        }
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={investor.investor_name}
                                                    secondary={
                                                        <Typography
                                                            sx={{
                                                                display: "inline",
                                                                fontSize: industryFontSize,
                                                            }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {investor.headquater_countrycode} - {" "}
                                                            {investor.headquater_city}
                                                            
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Box>

                            <Divider orientation="vertical" flexItem />
                            <Box p={2} width={500} maxWidth="100%">
                                <InvestorInfoWidget
                                    investor={selectedInvestor}
                                    bgcolor={colors.primary[500]}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default FounderMatches;