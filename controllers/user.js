const { setUser } = require('../service/auth');
const User = require('../models/user');

// create a user document in db
async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    try {
        await User.create({
            name,
            email,
            password
        });
        return res.status(301).redirect('/login');
    } catch (error) {
        console.error("Error handling user signup:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            email,
            password
        });
        if (!user) {
            return res.render("login", {
                error: "Invalid Username or Password"
            });
        }
        const token = setUser(user);
        res.cookie('uid', token);
        return res.redirect("/");
    } catch (error) {
        console.error("Error handling user login:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin
};
