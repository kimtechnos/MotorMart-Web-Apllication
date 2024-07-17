import express, { response } from 'express'
import { config } from "dotenv";


config();
const app = express();
app.get("/" ,(req,res) =>{
    res.send("<h1>welcome to the car dealer server....</h1>")
})
app.listen(3000, ()=>{
    console.log("sever is running on port 3000...");

})