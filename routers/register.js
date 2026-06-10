import { Router } from "express";
import {v7 as uuidv7} from "uuid";
import {hash} from "bcrypt";
import pool from "./../config/db.js"

const register = Router();
const saltRound = 12;


register.post('/',async (req, res) =>{
    try {
        const {username, email, password} = req.body;
        const usernameRegex = /^[a-z](?:[a-z0-9_]*[a-z0-9])?$/
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!usernameRegex.test(username)){
            return res.status(409).json({message: "username mustn\'t start with number or underscore or end with underscore"});
        }
        if(!emailRegex.test(email)){
            return res.status(409).json({message: "email must be like: name@example.com"});
        }
        if(password.length < 8 || password.length > 20){
            return res.status(409).json({message: "password length must be at least 8, and max 20"});
        }
        const userId = uuidv7();
        const hashPass = await hash(password, saltRound);
        const query = `
        INSERT INTO users_simple (id, username, email, hash_pass)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, created_at
        `
        const values = [userId, username, email, hashPass];
        const result = await pool.query(query, values);
        return res.status(201).json({
            message: "User registered successfully!",
            user: result.rows[0]
        });
    } catch (error) {
        const detail = error.detail || "";
        if(error.code === "23505"){
            if (detail.includes("username")){
                return res.status(409).json({message: "username already exists"});
            } else if (detail.includes("email")){
                return res.status(409).json({message: "email already registered."});
            }
            return res.status(409).json({message: "uniqueness error"});
        }
        return res.status(409).json({message: e.detail});
    }  
})

export default register;