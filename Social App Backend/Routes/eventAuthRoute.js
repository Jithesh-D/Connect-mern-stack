const express = require('express');
const { loginEventCreator } = require('../controllers/eventAuthController');

const eventAuthRoute = express.Router();

eventAuthRoute.post('/login', loginEventCreator);

module.exports = eventAuthRoute;