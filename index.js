import dotenv from "dotenv";
dotenv.config();
import express from "express";
import db from "./config/db.js"
import register from "./routers/register.js";

const app = express();
const PORT = process.env.PORT || 5001;
//middlewares
app.use(express.json());
// Routers
app.use("/register", register);

app.get('/', (req, res) => {
    res.json({message: "Hey there! it works"})
})

// app running
app.listen(PORT, () => console.log(`app running on port: ${PORT}`))