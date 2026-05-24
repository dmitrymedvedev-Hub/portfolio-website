const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/healthRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;