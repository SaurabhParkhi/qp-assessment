import express from 'express';
import cors from 'cors';
import authRouters from './routes/authRoute';
import productRouter from './routes/productRoutes';
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from 'url';

// const express = require("express");
// const cors = require("cors");

dotenv.config();

// const __dirname = path.resolve();

// console.log(__dirname)

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use('/api/auth', authRouters);
app.use('/api/products',productRouter)

// app.get("/",(request,response)=>{
//     response.send("Hello World");
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
