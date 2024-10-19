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
app.use('/admin', adminOnly);

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
    productId: String
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


//!Admin
//* AddProduct
app.post("/admin/add-product", upload.single("image"), async (req, res) => {
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
});


//!Admin
//* DeleteProduct 
app.post("/admin/add-product", upload.single("image"), async (req, res) => {
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
});

//* Add to Cart
app.post("/products/add-to-cart", async (req, res) => {
    try {
        const { productId, userId } = req.body;

        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ message: "Product is out of stock." });
        }

        let cart = new Cart({
            _id: uuidv4(),
            userId: userId,
            productId: productId
        });

        await cart.save();

        res.status(200).json({ message: `${product.name} added to cart.` });

    } catch (error) {
        console.error("Error adding product to cart:", error);

        res.status(500).json({ message: "An error occurred while adding the product to the cart." });
    }
});

//* Products in cart
app.post("/cart/products", async (req, res) => {
    try {
        const { userId } = req.body;
        
        const productsInCart = await Cart.aggregate([

            {
                $match: {userId: userId}
            },
            {
                $lookup: {
                    from: "products", // products koleksiyonundan veri al
                    localField: "productId", // Cart içindeki productId ile eşleştir
                    foreignField: "_id", // products koleksiyonundaki _id ile eşleştir
                    as: "producsInCartPerUser" 
                }
            }
        ]);

        res.json(productsInCart);
    } catch (error) {
        //console.error("Error fetching products in cart:", error);
        res.status(500).json({ message: "An error occurred while fetching products in cart." });
    }
});

//* Remove Product from Cart
app.post("/cart/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        await Cart.deleteMany({ userId: userId, productId: productId });  
        res.status(200).json({ message: "Product removed from cart." });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "An error occurred while removing the product from the cart." });
    }
});



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

//* Middleware for admin check
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "No token provided, access denied" });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // check admin
        if (!decoded.user.isAdmin) {
            return res.status(403).json({ message: "Admin access required" });
        }


        next();
    });
}

// Admin middleware for protecting admin routes
function adminOnly(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "No token provided, access denied" });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (!decoded.user.isAdmin) {
            return res.status(403).json({ message: "Admin access required" });
        }

        next();
    });
}



const port = 5000;

app.listen(port, () => {
    console.log(`Server (localhost) is running on port ${port}`);
});