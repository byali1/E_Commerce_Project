require('dotenv').config();
const mongoose = require("mongoose");

const rootMongo = process.env.ROOT;
const passwordMongo = process.env.MONGODB_PASSWORD;
const sourceMongo = process.env.SOURCE;

const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri =  `${rootMongo}${passwordMongo}@${sourceMongo}`;
mongoose.connect(uri).then(response => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error(`Error connecting to MongoDB ${err.message}`);
});

//User Collection
const userSchema = new mongoose.Schema({
    _id: String,
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String
});

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
const User = mongoose.model("User", userSchema);

//Product Collection
const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    price: Number,
    imageUrl: String,
    stock: Number
})
const Product = mongoose.model("Product", productSchema);

//Cart Collection
const cartSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    productId: String,
    quantity: Number,
    price: Number

})
const Cart = mongoose.model("Cart", cartSchema);

//Order Collection
const orderSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    productId: String,
    quantity: Number,
    price: Number
});
const Order = mongoose.model("Order", orderSchema);

//! Token
const secretKey = "Secret Key";
const options = {
    expiresIn: "1h"
}


//* Register
app.post("/auth/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        let user = new User({
            _id: uuidv4(),
            firstName,
            lastName,
            fullName: firstName + " " + lastName,
            email,
            password
        });
        await user.save();

        const payload = {
            user: user
        }
        const token = jwt.sign(payload, secretKey, options);
        res.json({ user: user, token: token });

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
})

//* Login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await User.find({ email: email, password: password });

        if (users.length == 0) {
            res.status(500).json({ message: "User not found" });
        } else {
            const payload = {
                user: users[0]
            }
            const token = jwt.sign(payload, secretKey, options);
            res.json({ user: users[0], token: token });
        }

    } catch (error) {
        
    }
})


const port = 5000;

app.listen(port, () => {
    console.log(`Server (localhost) is running on port ${port}`);
});