const express = require("express");
const {handleNewUrl,handleAnalytics} = require('../controllers/url')

const router = express.Router();

router.post("/",handleNewUrl);

router.get('/analytics/:shortId',handleAnalytics);

module.exports = router;