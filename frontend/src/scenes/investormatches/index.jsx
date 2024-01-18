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
import StartupRevenueChart from "../../components/StartupRevenueChart"; // Assuming this is the path to your new chart component

const CompanyInfoWidget = ({ startup, bgcolor }) => {
  const foundingDate = new Date(startup?.founding_date)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "/");

  return (
    <Card sx={{ marginBottom: 2, backgroundImage: "none", bgcolor: bgcolor }}>
      <CardContent>
        <Typography variant="h3" sx={{ marginBottom: ".75rem" }}>
          Company Information
        </Typography>
        <Typography>
          Headquarters: {startup?.headquater_city},{" "}
          {startup?.headquater_countrycode}
        </Typography>
        <Typography>Founding Date: {foundingDate}</Typography>
        <Typography>Industry: {startup?.industry}</Typography>
        <Typography>Subindustry: {startup?.subindustry}</Typography>
      </CardContent>
    </Card>
  );
};

// RevenueChartWidget.jsx

const RevenueChartWidget = ({ startup, bgcolor }) => {
  return (
    <Card sx={{ marginBottom: 2, backgroundImage: "none", bgcolor: bgcolor }}>
      <CardContent>
        <Typography variant="h3" sx={{ marginBottom: "0.5rem" }}>
          Annual Revenue
        </Typography>
        {startup ? (
          <Box sx={{ height: 300 }}>
            <StartupRevenueChart startupId={startup.id} />
          </Box>
        ) : (
          <Typography variant="subtitle1">
            Select a startup to view the revenue chart.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// NewsFeedWidget.jsx
const NewsFeedWidget = ({ startupCrunchbasePath, bgcolor }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (startupCrunchbasePath) {
      console.log("Fetching news for:", startupCrunchbasePath);

      fetch(`${process.env.REACT_APP_API_URL}/news/${startupCrunchbasePath}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((newsData) => {
          console.log("Received news data:", newsData); // Debugging
          setNews(newsData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching news:", err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      console.log("No startupCrunchbasePath provided");
      setLoading(false);
    }
  }, [startupCrunchbasePath]);

  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;

  if (!news.length) {
    console.log("No news available for:", startupCrunchbasePath); // Debugging
    return <div></div>;
  }

  return (
    <Card sx={{ backgroundImage: "none", bgcolor: bgcolor }}>
      <CardContent>
        <Typography variant="h3">News Feed</Typography>
        <List>
          {news.map((newsItem, index) => (
            <ListItem key={index}>
              <a
                href={newsItem.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "inherit",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {newsItem.title}
              </a>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const InvestorMatches = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startups, setStartups] = useState([]);
  const industryFontSize = "0.95rem"; // Adjust the font size for the industry text here

  const [selectedStartup, setSelectedStartup] = useState(null);
  const [selectedStartupCrunchbasePath, setSelectedStartupCrunchbasePath] =
    useState(null);
  const [newsCache, setNewsCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [news, setNews] = useState([]);

  const fetchNewsAndCache = (startupCrunchbasePath) => {
    if (startupCrunchbasePath) {
      if (newsCache[startupCrunchbasePath]) {
        // News data is already cached, use it from the cache
        setNews(newsCache[startupCrunchbasePath]);
        setLoading(false);
      } else {
        // News data is not cached, fetch it and cache the result
        fetch(`${process.env.REACT_APP_API_URL}/news/${startupCrunchbasePath}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((newsData) => {
            console.log("Received news data:", newsData); // Debugging
            setNews(newsData);
            setNewsCache((prevCache) => ({
              ...prevCache,
              [startupCrunchbasePath]: newsData, // Cache the news data
            }));
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching news:", err);
            setError(err.message);
            setLoading(false);
          });
      }
    } else {
      console.log("No startupCrunchbasePath provided");
      setLoading(false);
    }
  };

  // Click handler to set the selected startup
  const handleStartupClick = (startup) => {
    setSelectedStartup(startup);
    setSelectedStartupCrunchbasePath(startup.crunchbase_path); // Ensure this line is correct
  };

  useEffect(() => {
    // Fetching all startups
    fetch("http://localhost:5000/startups")
      .then((response) => response.json())
      .then((startupData) => {
        // Fetching revenue data for all startups
        const revenuePromises = startupData.map((startup) =>
          fetch(`http://localhost:5000/revenues/${startup.id}`).then((res) =>
            res.json()
          )
        );

        Promise.all(revenuePromises).then((revenues) => {
          const startupsWithRevenue = startupData.filter((startup, index) => {
            // Check if the startup has revenue data (assuming empty array means no data)
            return revenues[index].data.length > 0;
          });

          setStartups(startupsWithRevenue);
        });
      })
      .catch((error) => console.error("Error fetching startups:", error));
  }, []);

  return (
    <Box display="flex" m="20px">
      <Box flexGrow={1}>
        <Header title="Your Matches" subtitle="Check out your latest matches" />
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
                  {startups.map((startup, index) => (
                    <React.Fragment key={startup.id}>
                      <ListItem
                        alignItems="flex-start"
                        button
                        onClick={() => handleStartupClick(startup)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt={startup.startup_name}
                            src={
                              startup.logo_path ||
                              "../../assets/default_logo.jpg"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={startup.startup_name}
                          secondary={
                            <>
                              <Typography
                                sx={{
                                  display: "inline",
                                  fontSize: industryFontSize,
                                }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {startup.industry}
                              </Typography>
                              {" — " +
                                (startup.slogan || "No slogan available")}
                            </>
                          }
                        />
                      </ListItem>
                      {index !== startups.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Box>

              <Divider orientation="vertical" flexItem />
              <Box p={2} width={500} maxWidth="100%">
                <CompanyInfoWidget
                  startup={selectedStartup}
                  bgcolor={colors.primary[500]}
                />
                <RevenueChartWidget
                  startup={selectedStartup}
                  bgcolor={colors.primary[500]}
                />
              </Box>
              <Box pr={2} pt={2} pb={2} width={300} maxWidth="100%">
                <NewsFeedWidget
                  startupCrunchbasePath={selectedStartupCrunchbasePath}
                  news={newsCache[selectedStartupCrunchbasePath]} // Pass cached news data
                  fetchNewsAndCache={fetchNewsAndCache} // Pass the fetch function
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

export default InvestorMatches;