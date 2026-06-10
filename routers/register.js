import dotenv from "dotenv";
dotenv.config();
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
            res.status(201).json({message: "username mustn\'t start with number or underscore or end with underscore"})
        }
        if(!emailRegex.test(email)){
            res.status(201).json({message: "email must be like: name@example.com"})
        }
        if(password.length < 7 || password.length > 21){
            res.status(201).json({message: "password length must be at least 8, and max 20"})
        }
        const userId = uuidv7();
        const hashPass = await hash(password, saltRound);
        const query = `
        INSERT INTO users_simple (id, username, email, hash_pass, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, created_at
        `
        const values = [userId, username, email, hashPass,(new Date().toLocaleDateString('en-CA')).toString().split('T')[0]];
        const result = await pool.query(query, values);
        return res.status(201).json({
            message: "User registered successfully!",
            user: result.rows[0]
        });
    } catch (error) {
        if(error.code === "23505")
            res.status(409).json({message: "wrong email or password"})
    }
    
    res.json({message:"register router.", username})
})

export default register;