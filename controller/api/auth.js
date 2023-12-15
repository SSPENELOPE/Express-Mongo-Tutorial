const router = require('express').Router();
const User = require('../../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: "User already has an account" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashedPassword});

        await newUser.save();

        console.log("New User was created");

        return res.status(200).json({ message: "User was registered successfully" });
    } catch (error) {
        console.error('Error signing user up: ', error);
        return res.status(500).json({ message: "There was an internal server error, if the problem persist, please contact support" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({ message: "No user found with that email" });
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        } else {
            const token = jwt.sign({ userId: user._id }, "SuperDuperSecret", {
                expiresIn: "1d"
            });

            res.cookie('UUID', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                secure: true,
            });

            return res.status(200).json("User Logged in!")
        }
    } catch (error) {
        console.error('Error signing user up: ', error);
        return res.status(500).json({ message: "There was an internal server error, if the problem persist, please contact support" });
    }
})

module.exports = router;