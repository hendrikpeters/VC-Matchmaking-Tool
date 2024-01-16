const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'matchmaking_db'
});

// New route for Crunchbase news
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
      WHERE fd.year BETWEEN 2019 AND 2022
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
      SELECT s.id, s.startup_name, s.color, MIN(fd.year) as start_year, MAX(fd.year) as end_year, 
             MIN(fd.revenue) as start_revenue, MAX(fd.revenue) as end_revenue
      FROM financial_data fd
      JOIN startups s ON fd.startup_id = s.id
      GROUP BY s.id
      HAVING start_year <> end_year AND start_revenue > 0 AND end_revenue > 0;
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
      WHERE fd.year BETWEEN 2019 AND 2022
      ORDER BY fd.year, s.startup_name;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }

        // Rearrange the data for the bar chart
        const processedData = results.reduce((acc, { startup_name, year, profit_margin, color }) => {
            let yearData = acc.find(data => data.year === year);
            if (!yearData) {
                yearData = { year, color: `#${color}` };
                acc.push(yearData);
            }
            yearData[startup_name] = profit_margin;
            return acc;
        }, []);

        res.json(processedData);
    });
});




db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database...');
});

// Sample route
/* app.get('/api/data', (req, res) => {
  const sqlQuery = 'SELECT * FROM your_table'; // Update with your SQL query
  db.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
}); */

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));