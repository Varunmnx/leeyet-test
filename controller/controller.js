import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs"


export const addproducts =async(req,res,next)=>{
    let arrImages = req.files
    let {productname ,description,price} = req.body
    if(!arrImages)res.status(301).json({status:"failure",message:"please enter one  image"})
    let encode_image

    let imageArray = arrImages.map(file=>{
        let img = fs.readFileSync(file.path)
        return  encode_image = img.toString('base64')
    })

    // console.log(imageArray)
    price = Number(parseFloat(price).toFixed(2))

    let prod =await prisma.product.create({
        data:{
            name:productname,
            description:description,
            Price: price
        }
    })
    console.log(prod)
    imageArray.map(async (src,index)=>{
        await prisma.productImages.create({
                          data:{
                               filename:arrImages[index].path,
                               contentType: arrImages[index].fieldname,
                               imageBase64 :src,
                               productId:prod.id
                          },
                          include:{
                            product:true
                          }
        })
        console.log("product added")
    })

    // console.log("_____mongodb___images_____")
    // console.log(productwithimages)

    res.redirect("/")
}

export const showallProducts =async(req,res,next)=>{

    let allproductswithImages = await prisma.product.findMany({
        include:{
            ProductImages:true
        }
    })

    res.json({
        content:"all",
        allproductswithImages
    })

}