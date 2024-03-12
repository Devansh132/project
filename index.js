const express = require('express');
const path = require("path");
const cookieparser = require('cookie-parser');
const { connectMongo } = require('./connection')
const URL = require('./models/url')
const { restrictToLoggedinUserOnly, checkAuth } = require('./middleware/auth')


const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user');


const app = express();
const PORT = 7001;

connectMongo('mongodb://localhost:27017/short-url').then(() => console.log("Mongo Connected"))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());


app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

// Handle the request for short URLs
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                }
            }
        })
    if (!entry) {
        // If the entry is null
        return res.status(404).send('Short URL not found');
    }

    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
    console.log(`Server working at PORT,${PORT}`);
})

module.exports = app;
