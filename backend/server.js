const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get('/startups', (req, res) => {
    db.query('SELECT * FROM startups', (err, data) => {
        if (err) throw err;
        return res.json(data)
    });
});

app.get('/revenues', (req, res) => {
    const sqlQuery = `
      SELECT fd.startup_id, s.startup_name, s.color, fd.year, SUM(fd.revenue) as revenue
      FROM financial_data fd
      INNER JOIN startups s ON fd.startup_id = s.id
      WHERE fd.year BETWEEN 2016 AND 2022
      GROUP BY fd.startup_id, s.startup_name, s.color, fd.year
      ORDER BY fd.startup_id, fd.year;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }
        // Format results to include a '#' with the color hex code
        const formattedResults = results.map(row => ({
            ...row,
            color: `#${row.color}` // Ensure the color is a valid CSS hex color
        }));
        res.json(formattedResults);
    });
});

app.get('/revenues/:startupId', (req, res) => {
    const startupId = req.params.startupId;
    const sqlQuery = `
        SELECT fd.year, SUM(fd.revenue) as revenue, s.color
        FROM financial_data fd
        JOIN startups s ON fd.startup_id = s.id
        WHERE fd.startup_id = ?
        AND fd.year BETWEEN 2019 AND 2022
        GROUP BY fd.year, s.color
        ORDER BY fd.year;
    `;

    db.query(sqlQuery, [startupId], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        // Assuming color is a hex value stored in the database
        const formattedResults = {
            id: startupId,
            data: results.map(row => ({
                x: row.year.toString(),
                y: row.revenue
            })),
            color: results[0] ? `#${results[0].color}` : '#000000' // Default color if not specified
        };

        res.json(formattedResults);
    });
});

app.get('/cagr', (req, res) => {
    const sqlQuery = `
    SELECT s.id, 
    s.startup_name, 
    s.color, 
    fd_start.year AS start_year, 
    fd_end.year AS end_year, 
    fd_start.revenue AS start_revenue, 
    fd_end.revenue AS end_revenue
FROM startups s
JOIN financial_data fd_start ON s.id = fd_start.startup_id
JOIN financial_data fd_end ON s.id = fd_end.startup_id
WHERE fd_start.year = (
 SELECT MIN(year)
 FROM financial_data
 WHERE startup_id = s.id
)
AND fd_end.year = (
 SELECT MAX(year)
 FROM financial_data
 WHERE startup_id = s.id
);
`;


    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        // Calculate the CAGR for each startup and include the color
        const cagrResults = results.map(row => {
            const numOfYears = row.end_year - row.start_year;
            const cagr = (Math.pow((row.end_revenue / row.start_revenue), 1 / numOfYears) - 1) * 100;
            if (row.startup_name === "Contentful") {
                console.log(row, cagr);
            }
            return {
                startup_name: row.startup_name,
                cagr: parseFloat(cagr.toFixed(2)), // Keeping two decimal places for precision
                color: row.color // Include the color from the database
            };
        });

        res.json(cagrResults);
    });
});

app.get('/profitMargins', (req, res) => {
    const sqlQuery = `
      SELECT s.startup_name, s.color, fd.year, 
             IF(fd.revenue = 0, 0, (fd.net_income / fd.revenue) * 100) AS profit_margin
      FROM financial_data fd
      INNER JOIN startups s ON fd.startup_id = s.id
      WHERE fd.year BETWEEN 2020 AND 2022
      ORDER BY fd.year, s.startup_name;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        // Rearrange the data for the chart
        const processedData = results.reduce((acc, { startup_name, year, profit_margin, color }) => {
            if (!acc[year]) {
                acc[year] = {};
            }
            acc[year][startup_name] = {
                profitMargin: profit_margin,
                color: `#${color}`
            };
            return acc;
        }, {});

        res.json(processedData);
    });
});

app.get('/news/:organization', async (req, res) => {
    const organization = req.params.organization;
    try {
        let data = JSON.stringify({ "card_lookups": [] });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://www.crunchbase.com/v4/data/entities/organizations/${organization}/overrides?field_ids=%5B%22identifier%22,%22
      layout_id%22,%22facet_ids%22,%22title%22,%22short_description%22,%22is_locked%22%5D&section_ids=%5B%22timeline%22%5D`,
            headers: {
                'content-type': 'application/json',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            },
            data: data
        };
        const response = await axios.request(config);
        const news = response.data.cards.overview_timeline.entities
            .filter(item => item.properties.entity_def_id === "press_reference") // Filter out items with entityDefId other than "press_reference"
            .map((item) => {
                const article = item.properties;

                const url = article.activity_properties.url?.value; // Add a check for the existence of the url property
                return {
                    title: article.activity_properties.title,
                    url: url ? url : "", // Use a default value if url is undefined
                    date: article.activity_date,
                };
            });
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message)
    }
});

app.get('/cashBalance', (req, res) => {
    const sqlQuery = `
  SELECT s.startup_name, MAX(s.color) as color, fd.year, SUM(fd.cash) as total_cash
  FROM financial_data fd
  JOIN startups s ON fd.startup_id = s.id
  WHERE fd.year BETWEEN 2018 AND 2022
  GROUP BY s.startup_name, fd.year
  ORDER BY s.startup_name, fd.year;
`;


    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        // Transform the data for visualization
        const transformedData = results.reduce((acc, row) => {
            let startupData = acc.find(data => data.id === row.startup_name);
            if (!startupData) {
                startupData = { id: row.startup_name, color: row.color, data: [] };
                acc.push(startupData);
            }
            startupData.data.push({ x: row.year, y: row.total_cash });
            return acc;
        }, []);

        res.json(transformedData);
    });
});

app.get('/investors', (req, res) => {
    db.query('SELECT * FROM investors', (err, data) => {
        if (err) throw err;
        return res.json(data)
    });
});

app.get('/investors/matches', (req, res) => {
    db.query('SELECT * FROM investors WHERE logo_path IS NOT NULL', (err, data) => {
        if (err) throw err;
        return res.json(data);
    });
});

app.get('/investments/:investor', (req, res) => {
    const investor = req.params.investor;
    const series = req.query.series || 'series_a';

    const query = `SELECT * FROM funding_rounds WHERE JSON_CONTAINS(lead_investors, JSON_QUOTE(?)) AND investment_type = ?`;

    db.query(query, [investor, series], (err, results) => {
        if (err) {
            console.error('Database query error:', err);

            // Diagnostic: Send error details in response for debugging
            res.status(500).send('Error fetching data: ' + err.message);
            return;
        }

        const seriesData = {
            name: series,
            children: results.map(round => ({
                name: round.funded_organization_name,
                loc: round.money_raised,
                // Additional fields can be added here if necessary
            }))
        };

        res.json(seriesData);
    });
});

app.get('/investments/:investor/types', (req, res) => {
    const investor = req.params.investor;

    const query = `
        SELECT DISTINCT investment_type 
        FROM funding_rounds 
        WHERE JSON_CONTAINS(lead_investors, JSON_QUOTE(?))
        ORDER BY investment_type ASC
    `;

    db.query(query, [investor], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Error fetching investment types');
            return;
        }

        const investmentTypes = results.map(row => row.investment_type);
        res.json(investmentTypes);
    });
});

/* THIS STILL NEED TO BE PERSONALIZED TO INVESTOR NAME */
app.get('/investments/total/byType', (req, res) => {
    const query = `
        SELECT investment_type, SUM(money_raised) as total_investment
        FROM funding_rounds 
        GROUP BY investment_type WITH ROLLUP
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const formattedResults = results.reduce((acc, row) => {
            acc[row.investment_type || 'total'] = row.total_investment;
            return acc;
        }, {});

        res.json(formattedResults);
    });
});

app.get('/investments/:investor/total/byType', (req, res) => {
    const investor = req.params.investor;

    const query = `
        SELECT investment_type, SUM(money_raised) as total_investment
        FROM funding_rounds 
        WHERE JSON_CONTAINS(lead_investors, JSON_QUOTE(?))
        GROUP BY investment_type WITH ROLLUP
    `;

    db.query(query, [investor], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const formattedResults = results.reduce((acc, row) => {
            acc[row.investment_type || 'total'] = row.total_investment;
            return acc;
        }, {});

        res.json(formattedResults);
    });
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database...');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));