const shortid = require("shortid");
const URL = require('../models/url')

// Handle creation of new url
async function handleNewUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL not found" })
    const shortID = shortid();
    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitedHistory: [],
        createdBy: req.user._id,
    })
    return res.render("home", { id: shortID, })
}

// For handling clicks
async function handleAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}


module.exports = {
    handleNewUrl,
    handleAnalytics,
};