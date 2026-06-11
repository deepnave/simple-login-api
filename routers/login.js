import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import pool from "./../config/db.js";
import {compare} from "bcrypt";
import jwt from "jsonwebtoken";

const login = Router();

login.post("/", async (req, res) => {
    try {
        const {username, password} = req.body;
        const query = `
        SELECT id, username, email, hash_pass
        FROM users_simple
        WHERE username = $1;
        `
        const user = (await pool.query(query, [username])).rows[0];
        const result = await compare(password, user.hash_pass);
        if(result){
            const payload = {
                id:user.id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"1h"});
            return res.status(200).json({message: "user log in successfully!", token});
        }
        return res.status(401).json({message: "failed to login"});

    } catch (error) {
        return res.status(409).json({message: error});
    }
})

export default login;