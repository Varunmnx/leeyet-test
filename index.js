import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { PrismaClient } from "@prisma/client";
import ProductRoutes from "./router/routes.js"
import * as path from "path"
import cors from "cors";

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);



dotenv.config()
const prisma = new PrismaClient();
const PORT = process.env.PORT_NUMBER || 3000;
const app = express();
app.use(cors({
    origin:"*"
}));
app.use(express.json())
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/products",ProductRoutes)

app.get("/",async(req,res,next)=>{
    let allproductswithImages = await prisma.product.findMany({
        include:{
            ProductImages:true
        }
    })
    
    res.render('main.ejs',{title:"dfsds",allproductswithImages})
})




// let productwithimages = await prisma.productImages.findMany({
//     where:{
//         productId:"63b6833b1ec68bf8469fc019"
//     },
//     include:{
//         product:true
//     }
   
// })
// console.log("_____prodsg__")
// console.log(productwithimages)


app.listen(PORT,()=>console.log(`Running on ${PORT}`))