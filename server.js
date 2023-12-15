const express = require('express');
const db = require('./connection/connection.js');
const routes = require('./controller');

db.on('error', (error) => console.error(error));

db.once('open', () => console.log("Successfully Connected to our database"));

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.listen(PORT, async () => {
    console.log(`Now listening on port: ${PORT}`);
});