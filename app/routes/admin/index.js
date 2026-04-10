const express = require('express');
const app = express.Router();

// Import admin page routes


// Use admin page routes with /admin prefix
// app.use('/', pagesRoutes);
app.use('/',require('./authroutes'));

module.exports = app;