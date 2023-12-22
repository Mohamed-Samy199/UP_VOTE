import { config } from "dotenv";
import express from "express";
import { connectDB } from "./DB/Connection.js";
import { authRouter, commentRouter, productRouter, userRouter } from "./Modules/routes.index.js";
import { stackVar } from "./Utils/errorHandler.js";


const app = express();
const port = 3000;
const BaseURL = '/api/v1'

app.use(express.json())
app.use(`${BaseURL}/auth`, authRouter);
app.use(`${BaseURL}/user`, userRouter);
app.use(`${BaseURL}/product`, productRouter);
app.use(`${BaseURL}/comment`, commentRouter);

config({ path: "./DB/secret.env" })
connectDB()

app.all('*' , (req, res)=>{
    res.status(404).json({message : 'NOT Found Router'})
})
app.use((err , req , res , next)=>{
    if(err){
        if(process.env.ENV_MODE == 'dev'){
            return res.status(err['cause'] || 500).json({message : 'Fail Response' , Error : err.message , stack : stackVar})
        }
        return res.status(err['cause'] || 500).json({message : 'Fail Response' , Error : err.message})
    }
})
app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port ${port}`);
})
