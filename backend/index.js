require('dotenv').config();
const mongoose = require("mongoose");

const rootMongo = process.env.ROOT;
const passwordMongo = process.env.MONGODB_PASSWORD;
const sourceMongo = process.env.SOURCE;

const path = require('path');

const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

const uri = `${rootMongo}${passwordMongo}@${sourceMongo}`;
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
    password: String,
    isAdmin: Boolean 
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
    stock: Number,
    categoryName: String
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

//? API Operations

//* Register
app.post("/auth/register", async (req, res) => {
    try {
        const firstName = trimString(req.body.firstName);
        const lastName = trimString(req.body.lastName);
        const email = trimString(req.body.email);
        const password = trimString(req.body.password);

        let user = new User({
            _id: uuidv4(),
            firstName,
            lastName,
            fullName: firstName + " " + lastName,
            email,
            password,
            isAdmin: false
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

        const email = trimString(req.body.email);
        const password = trimString(req.body.password);

        const users = await User.find({ email: email, password: password });

        if (users.length == 0) {
            return res.status(404).json({ message: "User not found" });
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

//FileUpload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, getFormattedDate() + "-" + uuidv4() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

//* GetProducts
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}).sort({ name: 1 });
        res.json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//* AddProduct
app.post("/add-product", upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, stock, categoryName } = req.body;

        const product = new Product({
            _id: uuidv4(),
            name: trimString(name),
            description: description,
            price: price,
            imageUrl: req.file.path,
            stock: stock,
            categoryName: trimString(categoryName)
        });

        await product.save();
        res.json({ message: `Product (${product.name}) ADDED successfully!` });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

})

//* DeleteProduct
app.post("/delete-product", async (req, res) => {
    try {
        const { _id } = req.body;
        const { name } = req.body;
        await Product.findByIdAndDelete(_id);
        res.json({ message: `Product (${name}) DELETED successfully!` });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

//? API Operations - Final

//* Other Operations
function getFormattedDate() {
    const date = new Date();
    const day = date.getDate(); // Day
    const month = date.getMonth() + 1; // Month
    const year = date.getFullYear(); // Year

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}_${formattedMonth}_${year}`;
}

function trimString(str) {
    return str.trim();
}

const port = 5000;

app.listen(port, () => {
    console.log(`Server (localhost) is running on port ${port}`);
});