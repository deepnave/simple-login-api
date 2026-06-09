import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
// Routers

app.get('/', (req, res) => {
    res.json({message: "crucial"})
})

// app running
app.listen(PORT, () => console.log(`app running on port: ${PORT}`))