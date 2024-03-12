const jwt = require("jsonwebtoken");
const secret = "Devansh$123";

function setUser(user) {
    return jwt.sign({
        _id:user._id,
        email: user.email,
    }, secret);
}

function getUser(token) {
    try {
        if (!token) return null;
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};
