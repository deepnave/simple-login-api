import { Router } from "express";
import pool from "./../config/db.js";
import {compare} from "bcrypt";

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
            return res.status(200).json({message: "user log in successfully!", ...{username:user.username}})
        }
    } catch (error) {
        return res.status(409).json({message: error})
    }
})

export default login;