const express = require("express")
const router = express.Router()
const { UserUpload } = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { RestaurantUpload } = require("../model/restaurant.model")

// Get User
router.get("/", async (req, res) => {
    const user = await UserUpload.find().lean().exec();
    return res.status(200).json({ data: user })
})

// Post User
router.post("/", async (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            let userbody = {
                "name": req.body.name,
                "email": req.body.email,
                "password": hash
            }
            const user = UserUpload.create(userbody);
            return res.status(201).send("User created successfully")
        });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// Login method
router.post("/login", async (req, res) => {
    try {
        const user = await UserUpload.findOne({ email: req.body.email }).lean().exec();

        // Compare User password with Hash String
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result == true) {
                const userEmail = req.body.email
                const userData = { email: userEmail }
                const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
                return res.status(200).json({ accessToken: accessToken })
            } else {
                return res.status(500).send("User Authentication Failed")
            }
        });
    } catch {
        return res.status(404).json({ message: "User Not Found" })
    }
})

// Delete User
router.delete("/:id", async (req, res) => {
    try {
        const user = await UserUpload.findByIdAndDelete(req.params.id).lean().exec()
        return res.status(200).send("User Deleted")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router