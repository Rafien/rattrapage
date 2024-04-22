const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());

// Import routes
require('./routes')(app);

// Sync Sequelize models
sequelize.sync({ force: true }) // Use force: true only for development!
    .then(() => {
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    });