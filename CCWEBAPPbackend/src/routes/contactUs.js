const express = require('express');
const router = express.Router();

const { sendContactEmail } = require('../controllers/contactUsController');

router.post('/', sendContactEmail);

module.exports = router;