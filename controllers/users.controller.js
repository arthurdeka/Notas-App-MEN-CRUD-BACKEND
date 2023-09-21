const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

async function signup(req, res) {
    try {
        // get the email and password off req body
        const { email, password } = req.body;

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8)

        // create a user with the data
        await User.create({ email, password: hashedPassword });

        // respond
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
};

async function login(req, res) {
    try {
        // get the email and password off req body
        const { email, password } = req.body;

        // Find the user with requested email
        const user = await User.findOne({ email });
        if (!user) return res.sendStatus(401); // no user found

        // Compare sent in password with found user password hash
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) return res.sendStatus(401); // password dont match

        // create a JWT token
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const token = jwt.sign({ sub: user._id, exp }, process.env.JWT_SECRET);

        // set the cookie
        res.cookie("Authorization", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production', // make it work only in https / true on production, false on localhost
        })

        // send the JWT token
        res.sendStatus(200)

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    };
};

function logout(req, res) {
    try {
        res.clearCookie("Authorization");
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);

    };
};

function checkAuth(req, res) {
    try {
        console.log(req.user);
        res.sendStatus(200);
    
    } catch (err) {
        console.log(err);
        res.sendStatus(400);

    };
};

module.exports = {
    signup,
    login,
    logout,
    checkAuth,
};
