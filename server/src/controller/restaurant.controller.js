const express = require("express")
const router = express.Router()
const { RestaurantUpload } = require("../model/restaurant.model")
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

router.get("/", authenticateToken, async (req, res, next) => {
    try {
        const db = await RestaurantUpload.find().lean().exec();
        return res.status(200).json({ data: db })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.post("/", authenticateToken, async (req, res, next) => {
    try {
        const item = await RestaurantUpload.create(req.body);
        return res.status(201).send("Restaurent added successfully")
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.delete("/:id", authenticateToken, async (req, res, next) => {
    try {
        const item = await RestaurantUpload.findByIdAndDelete(req.params.id).lean().exec()
        return res.status(200).json({ data: item })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router