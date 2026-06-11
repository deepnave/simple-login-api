import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./config/db.js"
import register from "./routers/register.js";
import login from "./routers/login.js";
import authinticateToken from "./middleware/auth.js"

const app = express();
const PORT = process.env.PORT || 5001;
//middlewares
app.use(express.json());
// Routers
app.use("/register", register);
app.use("/login", login);

app.get('/', (req, res) => {
    res.json({message: "Hey there! it works"})
})

app.get('/dashboard', authinticateToken, (req, res) => {
    return res.json({message:"congrats, you're successfully loggedIn."})
})

// app running
app.listen(PORT, () => console.log(`app running on port: ${PORT}`))