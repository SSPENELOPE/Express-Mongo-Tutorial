const router = require('express').Router();

const apiRoutes = require('./api/auth.js');

router.use('/auth', apiRoutes);

module.exports = router;
