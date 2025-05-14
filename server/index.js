import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
dotenv.config();
import morgan from 'morgan';
import helmet, { crossOriginResourcePolicy } from 'helmet';


const app = express();
app.use(cors());
app.options('*', cors())

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    
}))


app.get("/", (request, response)=>{
    //server to client
    response.json({
        message : "Server is running on  port " + process.env.PORT
    })
})