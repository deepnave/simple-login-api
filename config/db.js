import dotenv from "dotenv"
dotenv.config();
import {Pool} from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


pool.query("SELECT NOW()", (err, res) => {
    if(err){
        console.log("database connectin error: ", err.stack);
    } else {
        console.log("database successfully connected");
    }
})

export default pool;